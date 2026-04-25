import type { MemberName } from "../types";

type Props = {
  members: MemberName[];
  visible: boolean;
  disabled: boolean;
  suggestedMembers: MemberName[];
  onSelect: (member: MemberName) => void;
};

export function MemberButtons({ members, visible, disabled, suggestedMembers, onSelect }: Props) {
  if (!visible) {
    return null;
  }

  const hasSuggestion = suggestedMembers.length > 0;

  return (
    <div className="member-grid" aria-label="member-buttons">
      {members.map((member) => {
        const isSuggested = suggestedMembers.includes(member);

        return (
          <button
            key={member}
            className={`member-button ${isSuggested ? "member-button--suggested" : ""}`.trim()}
            disabled={disabled || (hasSuggestion && !isSuggested)}
            onClick={() => onSelect(member)}
          >
            {member}
          </button>
        );
      })}
    </div>
  );
}
