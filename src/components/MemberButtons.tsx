import type { MemberName } from "../types";

type Props = {
  members: MemberName[];
  visible: boolean;
  disabled: boolean;
  onSelect: (member: MemberName) => void;
};

export function MemberButtons({ members, visible, disabled, onSelect }: Props) {
  if (!visible) {
    return null;
  }

  return (
    <div className="member-grid" aria-label="member-buttons">
      {members.map((member) => (
        <button key={member} className="member-button" disabled={disabled} onClick={() => onSelect(member)}>
          {member}
        </button>
      ))}
    </div>
  );
}
