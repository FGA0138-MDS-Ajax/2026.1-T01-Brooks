"use client"

import LeftBar from "@/components/LeftBar"
import LoginPage from "@/components/LoginPage"

export default function LoginRouter() {
    return (
        <div className="container">
            <LeftBar />
            <div className="form-side">
            <LoginPage />
            </div>
        </div>
    )
}