import express from "express";
import z from "zod";
import { tr } from "zod/locales";

// constants
const URL: string = "https://randomuser.me/api/";
const PORT: number = 3000;

// setup server
const app = express();
app.use(express.json());

app.listen(PORT, () => {
	console.log(`Server is running on port: ${PORT}`);
});

// schema validation for randomuser.me
const userSchema = z.object({
	results: z.array(
		z.object({
			name: z.object({
				first: z.string(),
				last: z.string(),
			}),
			location: z.object({
				city: z.string(),
				country: z.string(),
			}),
			dob: z.object({
				age: z.number(),
			}),
			email: z.string(),
		}),
	),
});

// type validation for the data
type User = z.infer<typeof userSchema>;

const addUserSchema = z.object({
	results: z.array(
		z.object({
			name: z.object({
				first: z.string(),
				last: z.string(),
			}),
			dob: z.object({
				age: z.number().min(18).max(100).default(28),
			}),
			email: z.string().toLowerCase().email(),
		}),
	),
});

// type validation for add user
type AddUser = z.infer<typeof addUserSchema>;

// routes
app.get("/", (req, res) => {
	res.send("Hello World");
});

app.get("/ping", (req, res) => {
	res.send("pong");
});

// get random user
app.get("/random-user", async (req, res) => {
	try {
		const response = await fetch(URL);
		const data = await response.json();
		const parsed = userSchema.safeParse(data);

		if (!parsed.success) {
			return res
				.status(500)
				.json({ error: "Invalid data from randomuser.me API" });
		}

		res.status(200).json(parsed);
	} catch (error) {
		return res.status(500).json({ error: "Failed to fetch random user" });
	}
});

// add user with validation
app.post("/add-user", async (req, res) => {
	try {
		const user = req.body;
		const parsed = addUserSchema.safeParse(user);

		if (!parsed.success) {
			return res.status(400).json({
				error: "Invalid data",
				details: parsed.error.format(tr),
			});
		}
		res.status(201).json({
			message: "User added successfully",
			user: parsed.data,
		});
	} catch (error) {
		return res.status(500).json({ error: "Failed to add user" });
	}
});
