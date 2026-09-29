
export const DEFAULT_SETTINGS = {
  hero_name: "Mian Adeel Hafeez",
  hero_subtext: "I bring together customer experience, brand thinking and digital execution to help ambitious businesses move forward.",
  cover_image_url: "",
  about_text_1: "From serving North American customers at Amazon's support operation to coaching teams on quality and customer satisfaction, I know what it takes to turn a difficult moment into a better experience.",
  about_text_2: "As the founder of a digital agency and a consumer brand, I've also led strategy, websites, marketing, vendors and delivery. I bring that operator's mindset to every collaboration.",
  resume_url: "",
  email: "minadeelhafeez1@gmail.com",
  phone: "+92 324 4411170",
  whatsapp: "923244411170",
  location: "Lahore, Pakistan ↗ USA",
  hourly_price: "$25",
  hourly_features: "Customer support (voice & chat)\nQuick design or copy tasks\nWebsite edits & fixes\nMinimum 5 hours / week\nSame-day response on weekdays",
  project_price: "Custom",
  project_features: "Brand identity & logo design\nWebsite design & development\nAd campaign setup & creative\nDefined scope & timeline\nMilestone-based delivery",
  fulltime_price: "$2,800",
  fulltime_features: "Dedicated support agent (USA hours)\nOngoing brand & web management\nMonthly ad & content strategy\nPriority availability\nWeekly performance reports"
};

export const mergedSettings = (s) => {
  const out = { ...DEFAULT_SETTINGS };
  for (const k of Object.keys(DEFAULT_SETTINGS)) {
    if (s && s[k] != null && s[k] !== "") out[k] = s[k];
  }
  return out;
};