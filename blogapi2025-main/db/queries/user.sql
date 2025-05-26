-- name: GetAllUsers :many
SELECT * FROM users;

-- name: GetUserByEmail :one
SELECT * FROM users WHERE email=? LIMIT 1;

-- name: CreateUser :execresult
INSERT INTO users(name,last_name,email,password,role,created_at,updated_at)
VALUES(?,?,?,?,?,now(),now());

-- name: UpdateRole :execresult
UPDATE users SET role = CASE 
WHEN role = 'admin' THEN 'user'
ELSE 'admin'
END
WHERE id = ?;