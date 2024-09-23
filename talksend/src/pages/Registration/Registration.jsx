import React, { useState } from 'react';
import Input from '../../components/Input/Input';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/Button/button';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

export default function Registration() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(false);

    if (email.trim().length < 6 || email.trim().length > 32) {
      setError(true);
      const errorMessage = "L'email doit être compris entre 6 et 32 caractères";
      toast.error(errorMessage);
      return;
    }

    if (password.trim().length < 6 || password.trim().length > 32) {
      setError(true);
      const errorMessage = "Le mot de passe doit être compris entre 6 et 32 caractères";
      toast.error(errorMessage);
      return;
    }

    if (passwordConfirm.trim() !== password.trim()) {
      setError(true);
      const errorMessage = "Les deux mots de passe ne sont pas conformes";
      toast.error(errorMessage);
      return;
    }

    localStorage.setItem("email", email);
    setIsLoading(true);
    const formData = new FormData();

    formData.set("name", name);
    formData.set("email", email);
    formData.set("password", password);
    formData.set("passwordConfirm", passwordConfirm);

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/v1.0.0/register", formData);

      if (response.data.success) {
        toast.success(response.data.message);
        setIsLoading(false);
        setTimeout(() => {
          navigate("/otp-code/" + email);
        }, 3000);
      } else {
        if (response.data.data?.name) {
          toast.error(response.data.data.name[0]);
        } else if (response.data.data?.email) {
          toast.error(response.data.data.email[0]);
        } else if (response.data.data?.password) {
          toast.error(response.data.data.password[0]);
        } else if (response.data.data?.passwordConfirm) {
          toast.error(response.data.data.passwordConfirm[0]);
        }

        setIsLoading(false);
      }
    } catch (error) {
      console.error("Erreur lors de l'enregistrement", error);
      toast.error("Une erreur est survenue lors de l'inscription.");
      setIsLoading(false);
    }
  };

  return (
    <div id="container"  className='container'  >
      <h1>Inscription</h1>
      <form onSubmit={handleSubmit}>
        <p>Inscription sur TalkSend</p>

        <Input
          label={"Nom"}
          reference={"name"}
          type={"text"}
          value={name}
          placeholder={"Saisir le nom ici"}
          onChange={(e) => setName(e.target.value)}
        />

        <Input
          label={"Email"}
          reference={"email"}
          type={"text"}
          value={email}
          placeholder={"Saisir votre e-mail ici"}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Input
          label={"Mot de passe"}
          reference={"password"}
          type={"password"}
          value={password}
          placeholder={"Saisir le mot de passe ici"}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Input
          label={"Confirmation"}
          reference={"passwordConfirm"}
          type={"password"}
          value={passwordConfirm}
          placeholder={"Confirmer le mot de passe ici"}
          onChange={(e) => setPasswordConfirm(e.target.value)}
        />

        <div id='submit' className='submit'>
          <Button
            disabled={isLoading}
            type={"submit"}
            text={isLoading ? "Chargement..." : "Soumettre"}
          /> <br />
          <Button type={"reset"} text={"Annuler"} />
        </div>

        <div>
          <Link to={"/"}>Connexion</Link>
        </div>
      </form>
    </div>
  );
}

