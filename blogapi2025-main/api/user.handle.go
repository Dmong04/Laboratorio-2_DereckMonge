package api

import (
	"database/sql"
	"net/http"
	"restapi/dto"
	"time"

	"github.com/gin-gonic/gin"
)

func (server *Server) GetAllUsers(ctx *gin.Context) {
	users, err := server.dbtx.GetAllUsers(ctx)
	if err != nil {
		if err == sql.ErrNoRows {
			ctx.JSON(http.StatusNotFound, errorResponse(err))
		}
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
	}
	ctx.JSON(http.StatusOK, users)
}

type SearchUserRequest struct {
	Email string `uri:"email" binding:"required"`
}

func (server *Server) GetUserByEmail(ctx *gin.Context) {
	var request SearchUserRequest
	ctx.ShouldBindUri(&request)
	user, err := server.dbtx.GetUserByEmail(ctx, request.Email)
	if err != nil {
		if err == sql.ErrNoRows {
			ctx.JSON(http.StatusNotFound, errorResponse(err))
		}
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
	}
	ctx.JSON(http.StatusOK, user)
}

type createUserRequest struct {
	Name     string `json:"name" binding:"required"`
	LastName string `json:"last_name" binding:"required"`
	Email    string `json:"email" binding:"required"`
	Password string `json:"password" binding:"required"`
	Role     string `json:"role"`
}

func (server *Server) createUser(ctx *gin.Context) {
	var req createUserRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(err))
		return
	}
	req.Role = "user_role"
	args := dto.CreateUserParams{
		Name:     req.Name,
		LastName: req.LastName,
		Email:    req.Email,
		Password: req.Password,
		Role:     req.Role,
	}
	result, err := server.dbtx.CreateUser(ctx, args)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}
	var lastId, _ = result.LastInsertId()
	ctx.JSON(http.StatusOK, gin.H{"generated_id": lastId})
}

type loginRequest struct {
	Email    string `json:"email" binding:"required"`
	Password string `json:"password" binding:"required"`
}
type loginResponse struct {
	AccessToken string       `json:"access_token"`
	User        userResponse `json:"user"`
}
type userResponse struct {
	Name     string `json:"name"`
	LastName string `json:"last_name"`
	Role     string `json:"role"`
}

func (server *Server) login(ctx *gin.Context) {
	var req loginRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(err))
		return
	}
	user, err := server.dbtx.GetUserByEmail(ctx, req.Email)
	if err != nil {
		if err == sql.ErrNoRows {
			ctx.JSON(http.StatusNotFound, errorResponse(err))
			return
		}
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}
	if user.Password != req.Password {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Usuario no autorizado"})
		return
	}
	//IMPORTANTE QUE LA DURACIÓN SE ESTABLEZCA EN EL .ENV
	accessToken, err := server.tokenBuilder.CreateToken(user.Email, time.Minute*5)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}
	resp := loginResponse{
		AccessToken: accessToken,
		User: userResponse{
			Name:     user.Name,
			LastName: user.LastName,
			Role:     user.Role,
		},
	}
	ctx.JSON(http.StatusOK, resp)
}

type UpdateRoleRequest struct {
	ID int32 `json:"id" binding:"required"`
}

func (server *Server) UpdateRole(ctx *gin.Context) {
	var request UpdateRoleRequest
	if err := ctx.ShouldBindJSON(&request); err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(err))
		return
	}
	user, err := server.dbtx.UpdateRole(ctx, request.ID)
	if err != nil {
		if err == sql.ErrNoRows {
			ctx.JSON(http.StatusNotFound, errorResponse(err))
			return
		}
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
	}
	ctx.JSON(http.StatusOK, user)
}
