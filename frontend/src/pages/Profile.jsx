import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import { getErrorMessage } from '../services/api';
import { formatDate, getInitials } from '../utils/helpers';
import { passwordChangeSchema } from '../utils/validators';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import Input from '../components/common/Input';
import ProfileForm from '../components/profile/ProfileForm';
import HealthConditionsForm from '../components/profile/HealthConditionsForm';
import GoalsSettings from '../components/profile/GoalsSettings';

export default function Profile() {
  const navigate = useNavigate();
  const { user, updateProfile, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const handleProfileSubmit = async (data) => {
    setLoading(true);
    try {
      await updateProfile(data);
      toast.success('Profil güncellendi');
    } catch (error) {
      toast.error(getErrorMessage(error, 'Profil güncellenirken bir hata oluştu'));
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="page-container">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Profile Header */}
        <Card>
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center">
              <span className="text-primary-600 font-bold text-2xl">
                {getInitials(user?.name)}
              </span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{user?.name}</h1>
              <p className="text-gray-500">{user?.email}</p>
              {formatDate(user?.createdAt, 'MMMM yyyy') && (
                <p className="text-sm text-gray-400 mt-1">
                  Üyelik: {formatDate(user.createdAt, 'MMMM yyyy')}'den beri
                </p>
              )}
            </div>
          </div>
        </Card>

        {/* Personal Info */}
        <ProfileForm
          user={user}
          onSubmit={handleProfileSubmit}
          loading={loading}
        />

        {/* Health Profile */}
        <HealthConditionsForm
          user={user}
          onSubmit={handleProfileSubmit}
          loading={loading}
        />

        {/* Goals Settings */}
        <GoalsSettings
          user={user}
          onSubmit={handleProfileSubmit}
          loading={loading}
        />

        {/* Account Settings */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Hesap Ayarları
          </h3>

          <div className="space-y-4">
            <Button
              variant="secondary"
              fullWidth
              onClick={() => setPasswordModalOpen(true)}
            >
              Şifre Değiştir
            </Button>

            <Button variant="secondary" fullWidth onClick={handleLogout}>
              Çıkış Yap
            </Button>

            <Button
              variant="danger"
              fullWidth
              onClick={() => setDeleteModalOpen(true)}
            >
              Hesabı Sil
            </Button>
          </div>
        </Card>
      </div>

      {/* Password Change Modal */}
      <PasswordChangeModal
        isOpen={passwordModalOpen}
        onClose={() => setPasswordModalOpen(false)}
      />

      {/* Delete Account Modal */}
      <DeleteAccountModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
      />
    </div>
  );
}

function PasswordChangeModal({ isOpen, onClose }) {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(passwordChangeSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await authService.changePassword(data.currentPassword, data.newPassword);
      toast.success('Şifre başarıyla değiştirildi');
      reset();
      onClose();
    } catch (error) {
      toast.error(getErrorMessage(error, 'Mevcut şifre hatalı'));
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Şifre Değiştir">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Mevcut Şifre"
          type="password"
          error={errors.currentPassword?.message}
          {...register('currentPassword')}
        />
        <Input
          label="Yeni Şifre"
          type="password"
          error={errors.newPassword?.message}
          {...register('newPassword')}
        />
        <Input
          label="Yeni Şifre (Tekrar)"
          type="password"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />

        <div className="flex gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={handleClose} className="flex-1">
            İptal
          </Button>
          <Button type="submit" loading={loading} className="flex-1">
            Kaydet
          </Button>
        </div>
      </form>
    </Modal>
  );
}

function DeleteAccountModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleDelete = async (e) => {
    e.preventDefault();

    setLoading(true);
    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success('Hesabınız silindi');
      logout();
      navigate('/login');
    } catch (error) {
      toast.error('Hesap silinemedi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Hesabı Sil">
      <form onSubmit={handleDelete} className="space-y-4">
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-sm text-red-800">
            <strong>Uyarı:</strong> Bu işlem geri alınamaz. Tüm verileriniz
            kalıcı olarak silinecektir.
          </p>
        </div>

        <Input
          label="Şifrenizi onaylayın"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Şifrenizi girin"
        />

        <div className="flex gap-3 pt-2">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            className="flex-1"
          >
            İptal
          </Button>
          <Button
            type="submit"
            variant="danger"
            loading={loading}
            disabled={!password}
            className="flex-1"
          >
            Hesabımı Sil
          </Button>
        </div>
      </form>
    </Modal>
  );
}
