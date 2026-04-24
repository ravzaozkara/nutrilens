import { describe, it, expect } from 'vitest';
import { evaluateHealthRules } from '../healthRules.js';

// Helpers
const meal = (overrides) => ({
  foodName: '',
  nutrition: { carbs: 0, protein: 0, fat: 0, calories: 0 },
  ...overrides,
});

describe('evaluateHealthRules', () => {
  // ── Null / empty input ───────────────────────────────────────────────────────

  it('returns [] for null meal', () => {
    expect(evaluateHealthRules(null, ['diabetes'])).toEqual([]);
  });

  it('returns [] for undefined meal', () => {
    expect(evaluateHealthRules(undefined, ['diabetes'])).toEqual([]);
  });

  it('returns [] for null healthConditions', () => {
    expect(evaluateHealthRules(meal(), null)).toEqual([]);
  });

  it('returns [] for non-array healthConditions', () => {
    expect(evaluateHealthRules(meal(), 'diabetes')).toEqual([]);
  });

  it('returns [] for meal with no fields', () => {
    // {} → foodName defaults to '', nutrition defaults to {}, carbs/protein → 0
    expect(evaluateHealthRules({}, ['diabetes', 'hypertension', 'kidney'])).toEqual([]);
  });

  // ── No health conditions ─────────────────────────────────────────────────────

  it('returns [] when user has no health conditions', () => {
    const highCarbMeal = meal({ nutrition: { carbs: 80, protein: 40 } });
    expect(evaluateHealthRules(highCarbMeal, [])).toEqual([]);
  });

  // ── Diabetes rules ───────────────────────────────────────────────────────────

  it('warns with severity "high" when diabetic user eats meal with carbs > 60g', () => {
    const result = evaluateHealthRules(
      meal({ nutrition: { carbs: 80 } }),
      ['diabetes']
    );
    expect(result).toHaveLength(1);
    expect(result[0].severity).toBe('high');
    expect(result[0].condition).toBe('diabetes');
  });

  it('does NOT warn for diabetic user when carbs === 60 (threshold is strictly greater)', () => {
    const result = evaluateHealthRules(
      meal({ nutrition: { carbs: 60 } }),
      ['diabetes']
    );
    expect(result).toHaveLength(0);
  });

  it('warns with severity "medium" when diabetic user eats a dessert by name (Baklava)', () => {
    const result = evaluateHealthRules(
      meal({ foodName: 'Baklava', nutrition: { carbs: 40 } }),
      ['diabetes']
    );
    expect(result).toHaveLength(1);
    expect(result[0].severity).toBe('medium');
    expect(result[0].condition).toBe('diabetes');
  });

  it('dessert name match is case-insensitive', () => {
    const result = evaluateHealthRules(
      meal({ foodName: 'BAKLAVA', nutrition: { carbs: 10 } }),
      ['diabetes']
    );
    expect(result).toHaveLength(1);
    expect(result[0].condition).toBe('diabetes');
  });

  it('carbs > 60 takes precedence over dessert name (else-if branch)', () => {
    // Both conditions true: only the high-carb warning fires
    const result = evaluateHealthRules(
      meal({ foodName: 'Baklava', nutrition: { carbs: 80 } }),
      ['diabetes']
    );
    expect(result).toHaveLength(1);
    expect(result[0].severity).toBe('high');
  });

  it('returns [] for non-diabetic user eating high-carb meal', () => {
    expect(
      evaluateHealthRules(meal({ nutrition: { carbs: 90 } }), ['hypertension'])
    ).toEqual([]);
  });

  // ── Hypertension rules ───────────────────────────────────────────────────────

  it('warns when hypertensive user eats a high-sodium dish by name (Turşu)', () => {
    const result = evaluateHealthRules(
      meal({ foodName: 'Turşu' }),
      ['hypertension']
    );
    expect(result).toHaveLength(1);
    expect(result[0].severity).toBe('medium');
    expect(result[0].condition).toBe('hypertension');
  });

  it('warns for hypertension on partial name match (e.g. "Ev Turşusu")', () => {
    const result = evaluateHealthRules(
      meal({ foodName: 'Ev Turşusu' }),
      ['hypertension']
    );
    expect(result).toHaveLength(1);
    expect(result[0].condition).toBe('hypertension');
  });

  it('returns [] for hypertensive user eating a dish not in the sodium list', () => {
    expect(
      evaluateHealthRules(meal({ foodName: 'Mercimek Çorbası' }), ['hypertension'])
    ).toEqual([]);
  });

  // ── Kidney disease rules ─────────────────────────────────────────────────────

  it('warns when kidney-disease user eats high-protein meal (protein > 30g)', () => {
    const result = evaluateHealthRules(
      meal({ nutrition: { protein: 35 } }),
      ['kidney']
    );
    expect(result.some(w => w.condition === 'kidney')).toBe(true);
    const proteinWarning = result.find(w => w.message.includes('protein'));
    expect(proteinWarning).toBeDefined();
    expect(proteinWarning.severity).toBe('medium');
  });

  it('does NOT warn for kidney user when protein === 30 (threshold is strictly greater)', () => {
    const result = evaluateHealthRules(
      meal({ nutrition: { protein: 30 } }),
      ['kidney']
    );
    // No protein warning; sodium warning may or may not fire depending on foodName
    expect(result.every(w => !w.message.includes('protein'))).toBe(true);
  });

  it('kidney user eating a high-sodium dish gets a sodium warning', () => {
    const result = evaluateHealthRules(
      meal({ foodName: 'Pastırma' }),
      ['kidney']
    );
    expect(result).toHaveLength(1);
    expect(result[0].condition).toBe('kidney');
    expect(result[0].message).toMatch(/sodyum/i);
  });

  it('kidney user with high protein AND salty dish gets two warnings', () => {
    const result = evaluateHealthRules(
      meal({ foodName: 'Pastırma', nutrition: { protein: 40 } }),
      ['kidney']
    );
    expect(result).toHaveLength(2);
    expect(result.every(w => w.condition === 'kidney')).toBe(true);
  });

  // ── Multiple conditions ──────────────────────────────────────────────────────

  it('fires warnings for multiple active conditions in one call', () => {
    const result = evaluateHealthRules(
      meal({ foodName: 'Sucuklu Yumurta', nutrition: { carbs: 70, protein: 35 } }),
      ['diabetes', 'hypertension', 'kidney']
    );
    const conditions = result.map(w => w.condition);
    expect(conditions).toContain('diabetes');    // carbs > 60
    expect(conditions).toContain('hypertension'); // sucuk matches sodium list
    expect(conditions).toContain('kidney');       // protein > 30 + sucuk sodium
  });

  // ── Backend warnings note ────────────────────────────────────────────────────
  //
  // The merging of backend `result.warnings` (mapped to condition:'backend', severity:'high')
  // into the final warnings list is done in AnalysisResult.jsx, NOT in evaluateHealthRules.
  // evaluateHealthRules is a pure function that only evaluates frontend heuristic rules.
  // Test that the function never produces a 'backend' condition entry on its own:

  it('never returns a warning with condition "backend" — that is set by AnalysisResult.jsx', () => {
    const result = evaluateHealthRules(
      meal({ foodName: 'Baklava', nutrition: { carbs: 90, protein: 40 } }),
      ['diabetes', 'hypertension', 'kidney']
    );
    expect(result.every(w => w.condition !== 'backend')).toBe(true);
  });
});
