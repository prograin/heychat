export function buildProfileChat(profile: any) {
  const missing = "❓";

  const firstName = profile.first_name || missing;
  const lastName = profile.last_name || missing;
  const age = profile.age !== undefined ? profile.age : missing;
  const gender = profile.gender || missing;
  const career = profile.career || missing;
  const city = profile.city || missing;
  const state = profile.state || missing;
  const country = profile.country || missing;
  const description = profile.description || null;

  const interestsStr = Array.isArray(profile.interests) && profile.interests.length > 0 ? profile.interests.join(", ") : missing;

  let genderSticker = "⚧";
  if (gender.toLowerCase() === "male") genderSticker = "👨";
  else if (gender.toLowerCase() === "female") genderSticker = "👩";

  // Career sticker
  let careerSticker = "💼";
  if (career.toLowerCase().includes("teacher")) careerSticker = "📚";
  else if (career.toLowerCase().includes("developer")) careerSticker = "💻";

  let profileText = `<b>🆔 Username:</b>/username_${profile.username || missing}
${genderSticker} <b>Name:</b> ${firstName} ${lastName}
🎂 <b>Age:</b> ${age}
${careerSticker} <b>Career:</b> ${career}
⭐ <b>Interests:</b> ${interestsStr}
📍 <b>Location:</b> ${city}, ${state}, ${country}`;

  if (description) {
    profileText += `\n<b>💬 Description:</b> <blockquote>${description}"</blockquote>`;
  }

  return profileText;
}
