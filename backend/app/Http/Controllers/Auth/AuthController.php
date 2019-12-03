<?php

namespace App\Http\Controllers\Auth;

use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Controller;
use App\Http\Requests\SignRequest;
use App\User;


class AuthController extends Controller
{
    /**
     * Create a new AuthController instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth:api', ['except' => ['signIn', 'signUp']]);
    }

    /**
     * Tries to log a user and responde with a jwt token 
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function signIn(SignRequest $request)
    {
        $credentials = request(['email', 'password']);
        if (!$token = auth()->attempt($credentials)) {
            return response()->json(['error' => "Email & Password don't match"], 401);
        }

        return $this->respondWithToken($token);
    }

    /**
     * Register a new User, authenticate it, 
     * @param request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function signUp(SignRequest $request)
    {
        $credentials['email'] = $request->register_email;
        $credentials['password'] = $request->register_password;

        User::create($credentials);
        $token = auth()->attempt($credentials);

        return $this->respondWithToken($token);
    }

    /**
     * Get the authenticated User.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function me()
    {
        return response()->json(auth()->user());
    }

    /**
     * Log the user out (Invalidate the token).
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function logout()
    {
        auth()->logout();

        return response()->json(['message' => 'Successfully logged out']);
    }

    /**
     * Refresh a token.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function refresh()
    {
        return $this->respondWithToken(auth()->refresh());
    }

    /**
     * Get the token array structure.
     *
     * @param  string $token
     *
     * @return \Illuminate\Http\JsonResponse
     */
    protected function respondWithToken($token)
    {
        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => auth()->factory()->getTTL() * 60,
            'userId' => auth()->user()->_id
        ]);
    }
}
