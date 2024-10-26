import { useEffect, useRef } from "react";

export const Log = () => {
  const ref = useRef(false);
  useEffect(() => {
    if (ref.current) return;
    console.info(`
░▒▓███████▓▒░░▒▓██████▓▒░░▒▓███████▓▒░░▒▓██████▓▒░ 
   ░▒▓█▓▒░  ░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░        
   ░▒▓█▓▒░  ░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░        
   ░▒▓█▓▒░  ░▒▓████████▓▒░▒▓███████▓▒░░▒▓█████▓▒░   
   ░▒▓█▓▒░  ░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░      ░▒▓█▓▒░        
   ░▒▓█▓▒░  ░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░      ░▒▓█▓▒░        
   ░▒▓█▓▒░  ░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░      ░▒▓██████▓▒░ 
                                                    
We love contributors → https://github.com/tapexyz`);
    ref.current = true;
  }, []);
  return null;
};
