import { auth } from "../utils/firebaseInit";

async function generateRecipeReport(index, mealName, restrictions, recipes) {
  console.log(recipes);

  const server_url = import.meta.env.VITE_SERVER_URL;
  const idToken = await auth.currentUser.getIdToken();

  const data = await fetch(`${server_url}/generate_recipe_report`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: idToken,
    },
    body: JSON.stringify({
      meal: mealName,
      restrictions: [...restrictions],
    }),
  });

  console.log(await data.json());
}

export { generateRecipeReport };
