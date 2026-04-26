import type { MemberName } from "../types";

type Props = {
  members: MemberName[];
  visible: boolean;
  disabled: boolean;
  selectedMember: MemberName | null;
  onSelect: (member: MemberName) => void;
};

const memberNicknames: Record<MemberName, string> = {
  Jungkook: "ジョングク / グク",
  RM: "ナムジュン / ナム",
  "j-hope": "ホソク / ホビ",
  SUGA: "ユンギ / シュガ",
  Jimin: "ジミン",
  V: "テヒョン / テテ",
  Jin: "ソクジン / ジン"
};


export function MemberButtons({ members, visible, disabled, selectedMember, onSelect }: Props) {
  if (!visible) {
    return null;
  }

  return (
    <div className="member-grid" aria-label="member-buttons">
      {members.map((member) => {
        const isSelected = selectedMember === member;

        return (
          <button
            key={member}
            className={`member-button ${isSelected ? "member-button--selected" : ""}`.trim()}
            disabled={disabled}
            aria-pressed={isSelected}
            onClick={() => onSelect(member)}
          >
            {member} ({memberNicknames[member]})
          </button>
        );
      })}
    </div>
  );
}
