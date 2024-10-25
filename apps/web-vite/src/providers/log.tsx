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
                                                    
We are open source: https://github.com/tapexyz`);
    ref.current = true;
  }, []);
  return null;
};
