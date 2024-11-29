import { Igreja, UserEquipeDirigente } from "@/api/get-profile-user";

// Função para processar os dados do perfil do usuário
export function getUserProfileData(profileUser: Igreja | UserEquipeDirigente) {
    let igrejaId = "";
    let idUserEquipeDirigente = "";
  
    if (profileUser && typeof profileUser === "object") {
      console.log("Dados recebidos:", profileUser);
  
      if ("cnpj" in profileUser) {
        // O perfil é do tipo Igreja
        igrejaId = profileUser.id;
        idUserEquipeDirigente = profileUser.id;
      } else if ("ano" in profileUser) {
        // O perfil é do tipo EquipeDirigente
        igrejaId = profileUser.igrejaId;
        idUserEquipeDirigente = profileUser.id;
      }
    }
  
    return { igrejaId, idUserEquipeDirigente };
  }
  