// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.29.0
// source: post.sql

package dto

import (
	"context"
	"database/sql"
)

const createPost = `-- name: createPost :execresult
INSERT INTO posts(id,user_id,category_id,title,content,image,created_at,updated_at)
VALUES(?,?,?,?,?,?,now(),now())
`

type createPostParams struct {
	ID         int32  `json:"id"`
	UserID     int32  `json:"user_id"`
	CategoryID int32  `json:"category_id"`
	Title      string `json:"title"`
	Content    string `json:"content"`
	Image      string `json:"image"`
}

func (q *Queries) createPost(ctx context.Context, arg createPostParams) (sql.Result, error) {
	return q.db.ExecContext(ctx, createPost,
		arg.ID,
		arg.UserID,
		arg.CategoryID,
		arg.Title,
		arg.Content,
		arg.Image,
	)
}

const getAllPost = `-- name: getAllPost :many
SELECT id, user_id, category_id, title, content, image, created_at, updated_at FROM posts
`

func (q *Queries) getAllPost(ctx context.Context) ([]Post, error) {
	rows, err := q.db.QueryContext(ctx, getAllPost)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []Post
	for rows.Next() {
		var i Post
		if err := rows.Scan(
			&i.ID,
			&i.UserID,
			&i.CategoryID,
			&i.Title,
			&i.Content,
			&i.Image,
			&i.CreatedAt,
			&i.UpdatedAt,
		); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Close(); err != nil {
		return nil, err
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

const getPostById = `-- name: getPostById :one
SELECT id, user_id, category_id, title, content, image, created_at, updated_at FROM posts WHERE id=? LIMIT 1
`

func (q *Queries) getPostById(ctx context.Context, id int32) (Post, error) {
	row := q.db.QueryRowContext(ctx, getPostById, id)
	var i Post
	err := row.Scan(
		&i.ID,
		&i.UserID,
		&i.CategoryID,
		&i.Title,
		&i.Content,
		&i.Image,
		&i.CreatedAt,
		&i.UpdatedAt,
	)
	return i, err
}
