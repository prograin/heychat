import { RelationsSelfService } from "src/bot/modules/relations/relations.service";

export class RelationSelfController {
  //-------------------Contact-----------------
  static userContacts = async (token: string) => {
    try {
      const response = await RelationsSelfService.userContacts(token);
      if (response.status === 200) {
        return { error: false, contacts: response.data.data, status: 201 };
      } else {
        throw new Error(`❌ Unexpected response status when getting user contacts: ${response.status}`);
      }
    } catch (error) {
      throw error;
    }
  };

  static createContact = async (token: string, targetId: string) => {
    try {
      const response = await RelationsSelfService.createContact(token, targetId);
      if (response.status === 201) {
        return { error: false, contact: response.data.data, status: 201 };
      } else {
        throw new Error(`❌ Unexpected response status when creating contact: ${response.status}`);
      }
    } catch (error) {
      throw error;
    }
  };

  static deleteContactByTargetId = async (token: string, targetId: string) => {
    try {
      const response = await RelationsSelfService.deleteContactByTargetId(token, targetId);
      if (response.status === 204) {
        return { error: false, status: 204 };
      } else {
        throw new Error(`❌ Unexpected response status when deleting contact: ${response.status}`);
      }
    } catch (error) {
      throw error;
    }
  };

  static checkContactByTargetId = async (token: string, targetId: string) => {
    try {
      const response = await RelationsSelfService.checkContactByTargetId(token, targetId);
      if (response.status === 200) {
        return { error: false, isContact: response.data.isContact, status: 200 };
      } else {
        throw new Error(`❌ Unexpected response status when checking contact: ${response.status}`);
      }
    } catch (error) {
      throw error;
    }
  };

  //-------------------Blocks-----------------
  static userBlocks = async (token: string) => {
    try {
      const response = await RelationsSelfService.userBlocks(token);
      if (response.status === 200) {
        return { error: false, blocks: response.data.data, status: 201 };
      } else {
        throw new Error(`❌ Unexpected response status when getting user blocks: ${response.status}`);
      }
    } catch (error) {
      throw error;
    }
  };

  static createBlock = async (token: string, targetId: string) => {
    try {
      const response = await RelationsSelfService.createBlock(token, targetId);
      if (response.status === 201) {
        return { error: false, block: response.data.data, status: 201 };
      } else {
        throw new Error(`❌ Unexpected response status when creating block: ${response.status}`);
      }
    } catch (error) {
      throw error;
    }
  };

  static deleteBlockByTargetId = async (token: string, targetId: string) => {
    try {
      const response = await RelationsSelfService.deleteBlockByTargetId(token, targetId);
      if (response.status === 204) {
        return { error: false, status: 204 };
      } else {
        throw new Error(`❌ Unexpected response status when deleting block: ${response.status}`);
      }
    } catch (error) {
      throw error;
    }
  };

  static checkBlockByTargetId = async (token: string, targetId: string, userId: string) => {
    const response = await RelationsSelfService.checkBlockByTargetId(token, targetId, userId);
    return { error: false, isBlocked: response.data.isBlocked, status: 200 };
  };
}
