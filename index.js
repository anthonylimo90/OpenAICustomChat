const path = require("path");

require("dotenv").config();

const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
    apiKey: process.env.OPEN_AI_API_KEY
});
const openai = new OpenAIApi(configuration);

const express = require("express");

const pug = require("pug");

const app = express();
app.use(express.json());

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.use(express.static(path.join(__dirname, "public")));

const port = process.env.PORT || 3000;

// Add in view for users to submit their prompts

app.get("/", (req, res) => {
    res.render(
        "index",
        { url: "/",  }
    );
});

app.get("/test", (req, res) => {
    res.render("test");
});

app.post("/ask", async (req, res) => {
    const prompt = req.body.prompt;

    try {
        if (prompt == null) {
            throw new Error("Uh oh! No prompt was provided");
        }
        const response = await openai.createCompletion({
            model: "text-davinci-300",
            prompt
        });
        const completion = response.data.choices[0].text;
        return res.status(200).json({
            success: true,
            message: prompt
        });
    } catch (error) {
        console.log(error.message);
    }
});

app.listen(port, () => console.log(`Server running on port: ${port}`));