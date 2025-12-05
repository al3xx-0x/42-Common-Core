import { Motion } from "@/app/types";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function AliasInput({onCreate, onCancel}: {onCreate: (alias: string) => void, onCancel: () => void}) {
	const { t } = useTranslation();
	const [alias, setAlias] = useState("");

	return (
		<Motion.div
      initial={{ opacity: 0 , y: 20}}
      animate={{ opacity: 1 , y: 0}}
      exit={{ opacity: 0 , y: 20}}
     className="fixed inset-0  backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-md  px-6 flex flex-col  justify-center rounded-lg bg-gradient-to-br bg-dark backdrop-blur-sm border border-[#21364a] hover:border-[#23ccdc]/30">
            <div className="flex justify-between items-center mb-6 mt-6">
              <h2 className="font-bold text-xl text-cyan-500">Select an alias</h2>
            </div>

            <div className="mb-6">
              <label className="block text-[#a4aca7] text-sm mb-2">Alias name</label>
              <input
                type="text"
                maxLength={12}
                minLength={3}
                placeholder={"Enter your alias name"}
                onChange={(e) => setAlias(e.target.value)}
                className="w-full p-3 bg-[#113A4B]/50 border border-[#498195]/30 rounded-md text-white focus:outline-none focus:border-[#23ccdc]  transition-all"
              />
            </div>
            <div className="flex flex-row justify-center items-center  gap-2 mb-2">
              <button
                className="rounded-lg transition-all duration-300 w-full hover:bg-cyan-500/20  py-3 "
                onClick={() => onCancel()}>
                {t('game.cancel')}
              </button>
				<button
					onClick={() => onCreate(alias.trim())}
					disabled={alias.trim().length < 3}
					className={`rounded-lg border font-bold flex items-center justify-center border-none w-full transition-all duration-300 py-3 ${
						alias.trim().length >= 3
						? "text-cyan-500/80 hover:bg-cyan-500/20  cursor-pointer"
						: "text-gray-500 cursor-not-allowed"
					}`}>
					{
						t('game.join')
					}
				</button>
            </div>
          </div>
        </Motion.div>
	);
}