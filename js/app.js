// Step 1: Paste your Supabase project settings here.
// You can find them in Supabase Dashboard > Project Settings > Data API / API Keys.
const SUPABASE_URL = "https://jeauektrfibjtjymhssc.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImplYXVla3RyZmlianRqeW1oc3NjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAxMzQzMTgsImV4cCI6MjA5NTcxMDMxOH0.Hyk2sb_u13gF8eN99l0giHDwoh3FoWpqOl3c7qOf9pQ";

// Step 2: This must match your Supabase table name.
const TABLE_NAME = "profiles";

const form = document.querySelector("#profileForm");
const message = document.querySelector("#message");
const submitButton = document.querySelector("#submitButton");
const buttonText = submitButton.querySelector(".button-text");

const clientReady =
  SUPABASE_URL.startsWith("https://") &&
  SUPABASE_ANON_KEY !== "PASTE_YOUR_SUPABASE_ANON_PUBLIC_KEY" &&
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
  buttonText.textContent = isLoading ? "Submitting..." : "Submit Registration";
}

function getRegistrationData() {
  return {
    name: form.name.value.trim(),
    gmail: form.gmail.value.trim().toLowerCase(),
    gender: form.gender.value,
  };
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!supabaseClient) {
    showMessage("Please paste your Supabase URL and anon key in js/app.js first.", "error");
    return;
  }

  const registration = getRegistrationData();

  if (!registration.gmail.endsWith("@gmail.com")) {
    showMessage("Please enter a valid Gmail address.", "error");
    return;
  }

  setLoading(true);
  showMessage("Sending registration to Supabase...");

  const { error } = await supabaseClient
    .from(TABLE_NAME)
    .insert([registration]);

  setLoading(false);

  if (error) {
    showMessage(`Submit failed: ${error.message}`, "error");
    return;
  }

  form.reset();
  showMessage("Registration saved successfully.", "success");
});
