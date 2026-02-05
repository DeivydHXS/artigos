<?php

namespace App\Services;

class ResponseService
{
    public static function send(string $message, int $statusCode = 200, mixed $data = [])
    {
        $isStatusValid = $statusCode >= 200 && $statusCode < 300 ? true : false;

        $res = [
            'message' => $message,
            'isStatusValid' => $isStatusValid
        ];

        if ($data != []) {
            if ($isStatusValid) {
                $res['data'] = $data;
            } else {
                $res['errors'] = $data;
            }
        }

        return response()->json($res, $statusCode);
    }
}
