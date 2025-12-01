import { QueryFilter } from "./search.type";

export function buildUserSearchMessage(user: any) {
  const missing = "❓";

  const username = user.username || missing;
  const firstName = user.first_name || missing;
  const age = user.age ? `${user.age} years old` : missing;
  const state = user.state || missing;
  const city = user.city || missing;
  const country = user.country || missing;
  const gender = user.gender || missing;
  const lastActive = formatLastSeenIranFa(user.last_active);
  const hasActiveChat = user.has_active_chat || false;
  const career = user.career || missing;
  const interests = Array.isArray(user.interests) ? user.interests.join(", ") : missing;

  const chatStatusIcon = hasActiveChat ? "🟢" : "🔴";
  const genderSticker = gender.toLowerCase() === "female" ? "🙍‍♀️" : gender.toLowerCase() === "male" ? "🙍‍♂️" : "⚧";

  const location = [country, state, city].filter(Boolean).join(", ");

  return `🔗 <b>Username:</b> /username_${username} ${genderSticker}
<blockquote>
<b>Name</b>       : <b>${firstName} ${age}</b>
<b>Location</b>   : <b>${location}</b>
<b>Career</b>     : <b>${career}</b>
<b>Interests</b>  : <b>${interests}</b>
----------------
<b>In Chat</b>    : <b>${chatStatusIcon}</b>
<b>Last Seen</b>  : <b>${lastActive}</b>
</blockquote>\n
`;
}

export function buildProfileSearch(profile: any) {
  const missing = "❓";

  const firstName = profile.first_name || missing;
  const lastName = profile.last_name || missing;
  const age = profile.age !== undefined ? profile.age : missing;
  const gender = profile.gender || missing;
  const career = profile.career || missing;
  const city = profile.city || missing;
  const state = profile.state || missing;
  const country = profile.country || missing;
  const lastActive = formatLastSeenIranFa(profile.last_active);
  const hasActiveChat = profile.has_active_chat || false;
  const description = profile.description || null;
  const interestsStr = Array.isArray(profile.interests) && profile.interests.length > 0 ? profile.interests.join(", ") : missing;

  let genderSticker = "⚧";
  if (gender.toLowerCase() === "male") genderSticker = "👨";
  else if (gender.toLowerCase() === "female") genderSticker = "👩";

  let careerSticker = "💼";
  if (career.toLowerCase().includes("teacher")) careerSticker = "📚";
  else if (career.toLowerCase().includes("developer")) careerSticker = "💻";

  const chatStatusIcon = hasActiveChat ? "🟢" : "🔴";

  let profileText = `<b>🆔 Username:</b>/username_${profile.username || missing}
${genderSticker} <b>Name:</b> ${firstName} ${lastName}
🎂 <b>Age</b>    : ${age}
${careerSticker} <b>Career</b>    : ${career}
⭐ <b>Interests</b>    : ${interestsStr}
📍 <b>Location</b>    : ${city}, ${state}, ${country}
----------------
<b>In Chat</b>    : <b>${chatStatusIcon}</b>
<b>Last Seen</b>  : <b>${lastActive}</b>`;

  if (description) {
    profileText += `\n----------------\n<b>💬 Description:</b> <blockquote>${description}"</blockquote>`;
  }

  return profileText;
}

export function buildSearchQueryOptions(selectedFields: string[] | null, userProfile: Record<string, any> | any) {
  const mustClauses = [];
  const shouldClauses = [];

  for (const fieldData of selectedFields || []) {
    const f: QueryFilter = JSON.parse(fieldData) as QueryFilter;
    if (["term", "terms"].includes(f.op)) {
      if (f.field == "gender") {
        shouldClauses.push({ [f.op]: { [f.field]: f.value ?? userProfile[f.field] } });
      } else {
        mustClauses.push({ [f.op]: { [f.field]: f.value ?? userProfile[f.field] } });
      }
    } else if (["gt", "gte", "lt", "lte", "eq"].includes(f.op)) {
      if (f.op === "eq") {
        mustClauses.push({ term: { [f.field]: f.value ?? userProfile[f.field] } });
      } else {
        mustClauses.push({ range: { [f.field]: { [f.op]: f.value ?? userProfile[f.field] } } });
      }
    } else {
      return { error: `Unsupported operator: ${f.op}` };
    }
  }
  const query = {
    bool: {
      must: mustClauses,
      should: shouldClauses,
    },
  };
  return query;
}

function formatLastSeenIranFa(date?: string | Date | null) {
  if (!date) return "A long time ago";

  const iranLocalString = new Date(date).toLocaleString("en-US", {
    timeZone: "Asia/Tehran",
  });

  const iranDate = new Date(iranLocalString);
  const nowIran = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Tehran" }));

  const diff = (nowIran.getTime() - iranDate.getTime()) / 1000;

  const minutes = diff / 60;
  const hours = minutes / 60;
  const days = hours / 24;
  const weeks = days / 7;

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${Math.floor(minutes)} minutes ago`;
  if (hours < 24) return `${Math.floor(hours)} hours ago`;
  if (days < 7) return `${Math.floor(days)} days ago`;
  if (weeks < 1) return "About a week ago";

  return "A long time ago";
}
