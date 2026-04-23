def test_register_success(client, test_user_data):
    response = client.post("/auth/register", json=test_user_data)
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == test_user_data["email"]
    assert data["is_diabetic"] == test_user_data["is_diabetic"]
    assert data["is_kidney_disease"] == test_user_data["is_kidney_disease"]
    assert "id" in data


def test_register_duplicate_email(client, test_user_data, registered_user):
    response = client.post("/auth/register", json=test_user_data)
    assert response.status_code == 400
    assert "zaten kayıtlı" in response.json()["detail"]


def test_login_success(client, registered_user, test_user_data):
    response = client.post(
        "/auth/login",
        data={"username": test_user_data["email"], "password": test_user_data["password"]},
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"


def test_login_wrong_password(client, registered_user, test_user_data):
    response = client.post(
        "/auth/login",
        data={"username": test_user_data["email"], "password": "wrongpassword"},
    )
    assert response.status_code == 401


def test_login_nonexistent_user(client):
    response = client.post(
        "/auth/login",
        data={"username": "nobody@test.com", "password": "test123"},
    )
    assert response.status_code == 401
