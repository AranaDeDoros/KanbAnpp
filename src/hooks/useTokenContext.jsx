import { useContext } from "react";
import { TokenContext } from "../context/TokenContext";

export function useTokenContext() {
  return useContext(TokenContext);
}
