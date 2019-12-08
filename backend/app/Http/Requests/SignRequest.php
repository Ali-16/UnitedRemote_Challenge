<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SignRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            /**
             * Rules for **signIn** requests
             */
            'email' => 'sometimes|bail|required|email|exists:users',
            'password' => 'sometimes|bail|required|between:6,25',

            /**
             * Rules for **singUp** requests
             */
            'register_email' => 'sometimes|bail|required|email|unique:users,email',
            'register_password' => 'sometimes|bail|required|between:6,25|confirmed',
            'register_password_confirmation' => 'sometimes|required'
        ];
    }

    public function messages()
    {
        return [
            'email.exists' => 'The selected email doesn\'t exist',
        ];
    }
}
