import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/button';
import { useNavigate, useParams } from 'react-router-dom';  
import axios from 'axios';

export default function OtpCode() {

    const [otpCode, setOtpCode] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const params = useParams();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        
        e.preventDefault();
        if (!otpCode) {
            toast.error("Veuillez saisir le code OTP.");
            return;
        }

        setIsLoading(true);
        const formData = new FormData();
        formData.set("code", otpCode);
        formData.set("email", params.email);

        try {
            const response = await axios.post("http://127.0.0.1:8000/api/v1.0.0/otp-code", formData);

            if (response.data.success) {
                navigate("/dashboard");
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error("Une erreur s'est produite lors de la vérification du code.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='container'>
            <ToastContainer />
            <p>Un code vous a été envoyé ({localStorage.getItem("email")})</p>
            <form onSubmit={handleSubmit}>
                <Input 
                    type="text"
                    label={"OTP-CODE"}
                    value={otpCode}
                    placeholder={"Saisir le code ici"}
                    onChange={(e) => setOtpCode(e.target.value)}
                />
                <Button 
                    disabled={isLoading}
                    text={isLoading ? "Chargement..." : "Soumettre"}
                    type={"submit"}
                />
            </form>
        </div>
    );
}