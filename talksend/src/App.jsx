import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import Input from './components/Input/Input';
import Button from './components/Button/button';
import './components/Style/style.css'
// import style from './components/Style/Style.css'


export default function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData();
    formData.set("email", email);
    formData.set("password", password);

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/v1.0.0/login", formData);

      if (response.data.success) {
        toast.success(response.data.message);
        setTimeout(() => {
          navigate("/dashboard");
        }, 3000);
      } else {
        console.log(response.data);
        toast.error("Email ou mot de passe incorrect");
      }
    } catch (error) {
      console.error(error);
      toast.error("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div id="container" className='container'>
      <ToastContainer />
      <h1>Connexion</h1>
      <form onSubmit={handleSubmit}>
        <p>Connectez-vous</p>

        <Input
          label={"Email"}
          reference={"email"}
          type={"email"}
          value={email}
          placeholder={"Saisir votre e-mail"}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Input
          label={"Mot de passe"}
          reference={"password"}
          type={"password"}
          value={password}
          placeholder={"Saisir votre mot de passe"}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div id='submit' className='submit'>
          <Button disabled={isLoading} type={"submit"} text={isLoading ? "Chargement" : "Soumettre"} />
          <br />
          <Button type={"reset"} text={"Annuler"} />
        </div>

        <div>
          <Link to={"/registration"}>Inscription</Link>
        </div>
      </form>
    </div>
  );
}
