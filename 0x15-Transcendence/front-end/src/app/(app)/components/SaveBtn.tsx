import { t } from "i18next";
import { Save } from "lucide-react";
import Loading from "./Loading";

const SaveBtn = ({isSaving, onClick}: {isSaving: boolean, onClick: () => void}) => {
    return (
      <button
        type={"submit"}
        onClick={() => onClick()}
        disabled={isSaving}
        className="ml-auto flex items-center gap-2 bg-cyan-500/30 hover:bg-cyan-500/50 disabled:opacity-60 text-white px-10 py-2 rounded-lg transition-all duration-300"
      >
        { !isSaving && <Save size={16}/> }
        <Loading isloading={isSaving} label={t("game.save")}/>
      </button>
    );
}

export default SaveBtn;