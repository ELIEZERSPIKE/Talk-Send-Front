import React, { useState } from 'react';
import Button from '../../components/Button/button';
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom"; // Ajoutez cette ligne
import Input from '../../components/Input/Input'; // Assurez-vous d'importer le composant Input

export default function Dashboard() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Déclarez isLoading ici
  const navigate = useNavigate(); // Initialisez useNavigate

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData();
    formData.set("name", name);
    formData.set("description", description);

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/v1.0.0/group", formData);

      if (response.data.success) {
        toast.success(response.data.message);
        setTimeout(() => {
          navigate("/dashboard"); // Vous pourriez vouloir naviguer vers une autre page
        }, 3000);
      } else {
        console.log(response.data);
        toast.error("Ça ne passe pas, c'est incorrect");
      }
    } catch (error) {
      console.error(error);
      toast.error("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1>Talk send</h1>
      <Button text={'Déconnexion'} />

      <div id="container">
        <ToastContainer />
        <h1>Créer un groupe</h1>
        <form onSubmit={handleSubmit}>
          <p>Créer un groupe</p>

          <Input
            label={"Nom"}
            reference={"name"}
            type={"text"}
            value={name}
            placeholder={"Saisir votre nom de groupe"}
            onChange={(e) => setName(e.target.value)}
          />

          <Input
            label={"Description"}
            reference={"description"}
            type={"text"}
            value={description}
            placeholder={"Saisir votre description de groupe"}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div>
            <Button disabled={isLoading} type={"submit"} text={isLoading ? "Chargement" : "Soumettre"} />
            <Button type={"reset"} text={"Annuler"} />
          </div>
        </form>
      </div>
    </div>
  );
}
