"use client"

import ForgotPasswordPage from "@/components/ForgotPasswordPage";
import LeftBar from "@/components/LeftBar";

export default function ForgotPasswordRoute() {
    return(
        <div className="container">
            < LeftBar />
            <div className="form-side">
                < ForgotPasswordPage />
            </div>
        </div>
    )
}