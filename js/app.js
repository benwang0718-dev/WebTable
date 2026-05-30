const SUPABASE_URL = "PASTE_YOUR_SUPABASE_PROJECT_URL";
const SUPABASE_ANON_KEY = "PASTE_YOUR_SUPABASE_ANON_PUBLIC_KEY";
const TABLE_NAME = "profiles";

const form = document.querySelector("#profileForm");
const message = document.querySelector("#message");
const submitButton = document.querySelector("#submitButton");
const buttonText = submitButton.querySelector(".button-text");

const clientReady =
  SUPABASE_URL.startsWith("https://") &&
  SUPABASE_ANON_KEY.length > 20;

const supabaseClient = clientReady
  ? supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

function showMessage(text, type = "") {
  message.textContent = text;
  message.className = `message ${type}`;
}

function setLoading(isLoading) {
  submitButton.disabled = isLoading;
  buttonText.textContent = isLoading ? "資料傳送中..." : "送出報名";
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!supabaseClient) {
    showMessage("請先在 js/app.js 填入 Supabase URL 和 anon key。", "error");
    return;
  }

  const name = form.name.value.trim();
  const gmail = form.gmail.value.trim().toLowerCase();
  const gender = form.gender.value;

  if (!gmail.endsWith("@gmail.com")) {
    showMessage("請輸入有效的 Gmail 地址。", "error");
    return;
  }

  setLoading(true);
  showMessage("正在建立你的展覽入場資料...");

  const { error } = await supabaseClient
    .from(TABLE_NAME)
    .insert([{ name, gmail, gender }]);

  setLoading(false);

  if (error) {
    showMessage(`送出失敗：${error.message}`, "error");
    return;
  }

  form.reset();
  showMessage("報名成功，展場見！", "success");
});
