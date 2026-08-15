export const DOM_CODE_TO_KEYSYM: Record<string, string> = {
  Space: "space",
  Enter: "Return",
  Tab: "Tab",
  Backspace: "BackSpace",
  Delete: "Delete",
  Insert: "Insert",
  Home: "Home",
  End: "End",
  PageUp: "Prior",
  PageDown: "Next",
  ArrowUp: "Up",
  ArrowDown: "Down",
  ArrowLeft: "Left",
  ArrowRight: "Right",
  Escape: "Escape",
  CapsLock: "Caps_Lock",
  NumLock: "Num_Lock",
  ScrollLock: "Scroll_Lock",
  PrintScreen: "Print",
  Pause: "Pause",
  ContextMenu: "menu",
  ShiftLeft: "shift",
  ShiftRight: "shift_r",
  ControlLeft: "ctrl",
  ControlRight: "ctrl_r",
  AltLeft: "alt",
  AltRight: "alt_r",
  MetaLeft: "super_l",
  MetaRight: "super_r",
  Quote: "apostrophe",
  Backquote: "grave",
  Minus: "minus",
  Equal: "equal",
  BracketLeft: "bracketleft",
  BracketRight: "bracketright",
  Backslash: "backslash",
  IntlBackslash: "backslash",
  IntlRo: "backslash",
  IntlYen: "yen",
  Semicolon: "semicolon",
  Comma: "comma",
  Period: "period",
  Slash: "slash",
  NumpadEnter: "KP_Enter",
  NumpadAdd: "KP_Add",
  NumpadSubtract: "KP_Subtract",
  NumpadMultiply: "KP_Multiply",
  NumpadDivide: "KP_Divide",
  NumpadDecimal: "KP_Decimal",
  NumpadEqual: "KP_Equal",
};

for (let i = 0; i < 26; i++) {
  DOM_CODE_TO_KEYSYM[`Key${String.fromCharCode(65 + i)}`] = String.fromCharCode(97 + i);
}
for (let i = 0; i < 10; i++) {
  DOM_CODE_TO_KEYSYM[`Digit${i}`] = String(i);
  DOM_CODE_TO_KEYSYM[`Numpad${i}`] = `KP_${i}`;
}
for (let i = 1; i <= 12; i++) {
  DOM_CODE_TO_KEYSYM[`F${i}`] = `F${i}`;
}

export const MODIFIER_KEYSYM: Record<"ctrl" | "shift" | "alt" | "meta", string> = {
  ctrl: "ctrl",
  shift: "shift",
  alt: "alt",
  meta: "super_l",
};
