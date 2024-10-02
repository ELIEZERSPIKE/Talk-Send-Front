import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "../Dasboard/Dasboard.css";

const Dashboard = () => {
  const [isCreatingGroup, setIsCreatingGroup] = useState(true);
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [groups, setGroups] = useState([]);
  const [email, setEmail] = useState("");
  const [inviteName, setInviteName] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [file, setFile] = useState(null);
  const [groupId, setGroupId] = useState(null);

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await fetch("http://127.0.0.1:8000/api/v1.0.0/groups");
      const data = await response.json();
      setGroups(data.data[0] || []);
    } catch (error) {
      setError("Erreur lors de la récupération des groupes.");
      setGroups([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggle = () => {
    setIsCreatingGroup(!isCreatingGroup);
  };

  const handleCreateGroup = async () => {
    if (groupName && groupDescription) {
      const newGroup = { name: groupName, description: groupDescription };
      try {
        await fetch("http://127.0.0.1:8000/api/v1.0.0/group", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newGroup),
        });
        fetchGroups();
        setGroupName("");
        setGroupDescription("");
        toast.success("Groupe créé avec succès !");
      } catch (error) {
        console.error("Erreur lors de la création du groupe:", error);
        toast.error("Erreur lors de la création du groupe.");
      }
    }
  };

  const handleSendInvitation = async () => {
    if (inviteName && email && selectedGroup) {
      const invitationData = { name: inviteName, email: email };
      try {
        await fetch(
          `http://127.0.0.1:8000/api/v1.0.0/groups/${selectedGroup}/invite`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(invitationData),
          }
        );
        setInviteName("");
        setEmail("");
        setSelectedGroup("");
        toast.success("Invitation envoyée avec succès !");
      } catch (error) {
        console.error("Erreur lors de l'envoi de l'invitation:", error);
        toast.error("Erreur lors de l'envoi de l'invitation.");
      }
    } else {
      toast.warn("Veuillez remplir tous les champs !");
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSend = async (e, id) => {
    e.preventDefault();
    setGroupId(id); // Met à jour le groupId
    if (file && groupId) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("group_id", groupId); // Ajoute le group_id ici

      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/v1.0.0/upload-file/${groupId}`,
          {
            method: "POST",
            body: formData,
          }
        );

        if (!response.ok) {
          throw new Error("Erreur lors de l'envoi du fichier.");
        }

        setFile(null);
        toast.success("Fichier envoyé avec succès !");
      } catch (error) {
        console.error("Erreur lors de l'envoi du fichier:", error);
        toast.error("Erreur lors de l'envoi du fichier: " + error.message);
      }
    } else {
      toast.warn("Veuillez sélectionner un fichier et un groupe !");
    }
  };

  return (
    <div>
      <ToastContainer />
      <h1>Rafiki Corporation</h1>
      <button onClick={handleToggle}>
        {isCreatingGroup ? "Envoyer une invitation" : "Créer un groupe"}
      </button>

      {isCreatingGroup ? (
        <div>
          <h2>Créer un groupe</h2>
          <input
            type="text"
            placeholder="Nom du groupe"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Description du groupe"
            value={groupDescription}
            onChange={(e) => setGroupDescription(e.target.value)}
          />
          <button onClick={handleCreateGroup}>Créer le groupe</button>
        </div>
      ) : (
        <div>
          <h2>Envoyer une invitation</h2>
          <input
            type="text"
            placeholder="Nom de la personne invitée"
            value={inviteName}
            onChange={(e) => setInviteName(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email de la personne"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <select
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
          >
            <option value="">Sélectionner un groupe</option>
            {Array.isArray(groups) && groups.length > 0 ? (
              groups.map((group) => (
                <option key={group.id} value={group.id}>
                  {group.name}
                </option>
              ))
            ) : (
              <option disabled>Aucun groupe disponible</option>
            )}
          </select>
          <button onClick={handleSendInvitation}>Envoyer l'invitation</button>
        </div>
      )}

      <h2>Groupes auxquels vous appartenez</h2>
      {isLoading ? (
        <p>Chargement des groupes...</p>
      ) : (
        <>
          {error && <p style={{ color: "red" }}>{error}</p>}
          <div>
            {groups.length > 0 ? (
              groups.map((group) => (
                <div key={group.id}>
                  <strong>{group.name}</strong>: {group.description}
                  <form onSubmit={(e) => handleSend(e, group.id)}>
                    <h3>Envoyer un fichier</h3>
                    <input type="file" onChange={handleFileChange} />
                    <button type="submit">Envoyer le fichier</button>
                  </form>
                </div>
              ))
            ) : (
              <li>Aucun groupe disponible</li>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;































// import React, { useState, useEffect } from "react";
// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import "../Dasboard/Dasboard.css";

// const Dashboard = () => {
//   const [isCreatingGroup, setIsCreatingGroup] = useState(true);
//   const [groupName, setGroupName] = useState("");
//   const [groupDescription, setGroupDescription] = useState("");
//   const [groups, setGroups] = useState([]);
//   const [email, setEmail] = useState("");
//   const [inviteName, setInviteName] = useState("");
//   const [selectedGroup, setSelectedGroup] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [file, setFile] = useState(null);
//   const [files, setFiles] = useState([]);
//   const [groupSearch, setGroupSearch] = useState("");

//   useEffect(() => {
//     fetchGroups();
//   }, []);

//   const fetchGroups = async () => {
//     setIsLoading(true);
//     setError("");
//     try {
//       const response = await fetch("http://127.0.0.1:8000/api/v1.0.0/groups");
//       const data = await response.json();
//       setGroups(data.data[0] || []);
//     } catch (error) {
//       setError("Erreur lors de la récupération des groupes.");
//       setGroups([]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const fetchFiles = async (groupId) => {
//     setIsLoading(true);
//     setError("");
//     try {
//       const response = await fetch(`http://127.0.0.1:8000/api/v1.0.0/group/${groupId}/files`);
//       const data = await response.json();
//       setFiles(data.files || []);
//     } catch (error) {
//       setError("Erreur lors de la récupération des fichiers.");
//       setFiles([]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleToggle = () => {
//     setIsCreatingGroup(!isCreatingGroup);
//   };

//   const handleCreateGroup = async () => {
//     if (groupName && groupDescription) {
//       const newGroup = { name: groupName, description: groupDescription };
//       try {
//         await fetch("http://127.0.0.1:8000/api/v1.0.0/group", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(newGroup),
//         });
//         fetchGroups();
//         setGroupName("");
//         setGroupDescription("");
//         toast.success("Groupe créé avec succès !");
//       } catch (error) {
//         console.error("Erreur lors de la création du groupe:", error);
//         toast.error("Erreur lors de la création du groupe.");
//       }
//     }
//   };

//   const handleSendInvitation = async () => {
//     if (inviteName && email && selectedGroup) {
//       const invitationData = { name: inviteName, email: email };
//       try {
//         await fetch(
//           `http://127.0.0.1:8000/api/v1.0.0/groups/${selectedGroup}/invite`,
//           {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify(invitationData),
//           }
//         );
//         setInviteName("");
//         setEmail("");
//         setSelectedGroup("");
//         toast.success("Invitation envoyée avec succès !");
//       } catch (error) {
//         console.error("Erreur lors de l'envoi de l'invitation:", error);
//         toast.error("Erreur lors de l'envoi de l'invitation.");
//       }
//     } else {
//       toast.warn("Veuillez remplir tous les champs !");
//     }
//   };

//   const handleFileChange = (e) => {
//     setFile(e.target.files[0]);
//   };

//   const handleSend = async (e, id) => {
//     e.preventDefault();
//     if (file && id) {
//       const formData = new FormData();
//       formData.append("file", file);

//       try {
//         const response = await fetch(
//           `http://127.0.0.1:8000/api/v1.0.0/upload-file/${id}`,
//           {
//             method: "POST",
//             body: formData,

//           }

//         );

//         if (!response.ok) {
//           throw new Error("Erreur lors de l'envoi du fichier.");
//         }

//         setFile(null);
//         toast.success("Fichier envoyé avec succès !");
//       } catch (error) {
//         console.error("Erreur lors de l'envoi du fichier:", error);
//         toast.error("Erreur lors de l'envoi du fichier.");
//       }
//     } else {
//       toast.warn("Veuillez sélectionner un fichier et un groupe !");
//     }
//   };

//   const handleSearchFiles = () => {
//     const group = groups.find(g => g.name.toLowerCase() === groupSearch.toLowerCase());
//     if (group) {
//       fetchFiles(group.id);
//     } else {
//       toast.warn("Groupe non trouvé !");
//     }
//   };

//   return (
//     <div>
//       <ToastContainer />
//       <h1>Rafiki Corporation</h1>
//       <button onClick={handleToggle}>
//         {isCreatingGroup ? "Envoyer une invitation" : "Créer un groupe"}
//       </button>

//       {isCreatingGroup ? (
//         <div>
//           <h2>Créer un groupe</h2>
//           <input
//             type="text"
//             placeholder="Nom du groupe"
//             value={groupName}
//             onChange={(e) => setGroupName(e.target.value)}
//           />
//           <input
//             type="text"
//             placeholder="Description du groupe"
//             value={groupDescription}
//             onChange={(e) => setGroupDescription(e.target.value)}
//           />
//           <button onClick={handleCreateGroup}>Créer le groupe</button>
//         </div>
//       ) : (
//         <div>
//           <h2>Envoyer une invitation</h2>
//           <input
//             type="text"
//             placeholder="Nom de la personne invitée"
//             value={inviteName}
//             onChange={(e) => setInviteName(e.target.value)}
//           />
//           <input
//             type="email"
//             placeholder="Email de la personne"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//           />
//           <select
//             value={selectedGroup}
//             onChange={(e) => setSelectedGroup(e.target.value)}
//           >
//             <option value="">Sélectionner un groupe</option>
//             {groups.map((group) => (
//               <option key={group.id} value={group.id}>
//                 {group.name}
//               </option>
//             ))}
//           </select>
//           <button onClick={handleSendInvitation}>Envoyer l'invitation</button>
//         </div>
//       )}

//       {/* Champ de recherche pour les fichiers */}
//       <div>
//         <h2>Rechercher des fichiers par groupe</h2>
//         <input
//           type="text"
//           placeholder="Nom du groupe"
//           value={groupSearch}
//           onChange={(e) => setGroupSearch(e.target.value)}
//         />
//         <button onClick={handleSearchFiles}>Lister les fichiers</button>
//       </div>

//       <h2>Groupes auxquels vous appartenez</h2>
//       {isLoading ? (
//         <p>Chargement des groupes...</p>
//       ) : (
//         <div>
//           {groups.length > 0 ? (
//             groups.map((group) => (
//               <div key={group.id}>
//                 <strong>{group.name}</strong>: {group.description}
//                 <form onSubmit={(e) => handleSend(e, group.id)}>
//                   <h3>Envoyer un fichier</h3>
//                   <input type="file" onChange={handleFileChange} />
//                   <button type="submit">Envoyer le fichier</button>
//                 </form>
//               </div>
//             ))
//           ) : (
//             <p>Aucun groupe disponible</p>
//           )}
//         </div>
//       )}

//       <h2>Fichiers du groupe sélectionné</h2>
//       {isLoading ? (
//         <p>Chargement des fichiers...</p>
//       ) : (
//         <div>
//           {files.length > 0 ? (
//             <table>
//               <thead>
//                 <tr>
//                   <th>Nom du fichier</th>
//                   <th>Télécharger</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {files.map((file) => (
//                   <tr key={file.id}>
//                     <td>{file.name}</td>
//                     <td>
//                       <a href={`http://127.0.0.1:8000/path/to/files/${file.id}`} download>
//                         Télécharger
//                       </a>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           ) : (
//             <p>Aucun fichier disponible pour ce groupe.</p>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Dashboard;
























