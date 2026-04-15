import { v4 as uuidv4 } from "uuid"

const PLAYER_ID_KEY = "noman_player_id"
const PLAYER_NAME_KEY = "noman_player_name"

export function getPlayerId(): string {
  let id = localStorage.getItem(PLAYER_ID_KEY)
  if (!id) {
    id = uuidv4()
    localStorage.setItem(PLAYER_ID_KEY, id)
  }
  return id
}

export function getPlayerName(): string | null {
  return localStorage.getItem(PLAYER_NAME_KEY)
}

export function setPlayerName(name: string): void {
  localStorage.setItem(PLAYER_NAME_KEY, name.trim())
}

export function getPlayerData(): { playerId: string; name: string | null } {
  return {
    playerId: getPlayerId(),
    name: getPlayerName(),
  }
}