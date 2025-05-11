export const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
        const response = await fetch("http://127.0.0.1:8000/predict/", {
            method: "POST",
            body: formData
        });

        if (!response.ok) {
            throw new Error("Failed to fetch");
        }

        return await response.json();
    } catch (error) {
        console.error("Error:", error);
        return null;
    }
};
