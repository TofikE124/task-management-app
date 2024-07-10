const defaultData = {
  boards: [
    {
      id: "board-1",
      title: "Personal Projects",
      columns: [
        {
          id: "column-1",
          title: "To Do",
          color: "#FF6F61",
          boardId: "board-1",
          tasks: [
            {
              id: "task-1",
              title: "Grocery Shopping",
              description: "Buy weekly groceries for the house.",
              columnId: "column-1",
              subtasks: [
                { id: "subtask-1", title: "Buy milk", checked: true },
                { id: "subtask-2", title: "Buy bread", checked: true },
                { id: "subtask-3", title: "Buy vegetables", checked: false },
              ],
            },
            {
              id: "task-2",
              title: "Clean the House",
              description: "Do a thorough cleaning of the entire house.",
              columnId: "column-1",
              subtasks: [
                {
                  id: "subtask-4",
                  title: "Vacuum the living room",
                  checked: false,
                },
                { id: "subtask-5", title: "Dust the shelves", checked: false },
                {
                  id: "subtask-6",
                  title: "Mop the kitchen floor",
                  checked: true,
                },
              ],
            },
            {
              id: "task-3",
              title: "Study for Math Test",
              description: "Prepare for the upcoming math test.",
              columnId: "column-1",
              subtasks: [
                {
                  id: "subtask-7",
                  title: "Review algebra notes",
                  checked: true,
                },
                {
                  id: "subtask-8",
                  title: "Complete practice problems",
                  checked: true,
                },
                {
                  id: "subtask-9",
                  title: "Meet with study group",
                  checked: false,
                },
              ],
            },
            // Add more tasks here
          ],
        },
        {
          id: "column-2",
          title: "In Progress",
          color: "#6B5B95",
          boardId: "board-1",
          tasks: [
            {
              id: "task-4",
              title: "Online Course: React",
              description: "Complete modules of the React course.",
              columnId: "column-2",
              subtasks: [
                {
                  id: "subtask-10",
                  title: "Module 1: Introduction",
                  checked: true,
                },
                {
                  id: "subtask-11",
                  title: "Module 2: Components",
                  checked: false,
                },
                {
                  id: "subtask-12",
                  title: "Module 3: State and Props",
                  checked: true,
                },
              ],
            },
            {
              id: "task-5",
              title: "Exercise Routine",
              description: "Stick to the daily exercise routine.",
              columnId: "column-2",
              subtasks: [
                { id: "subtask-13", title: "Morning jog", checked: true },
                { id: "subtask-14", title: "Evening yoga", checked: true },
              ],
            },
            {
              id: "task-6",
              title: "Read a Book",
              description: "Finish reading the current book.",
              columnId: "column-2",
              subtasks: [
                { id: "subtask-15", title: "Read chapters 1-3", checked: true },
                {
                  id: "subtask-16",
                  title: "Read chapters 4-6",
                  checked: false,
                },
                {
                  id: "subtask-17",
                  title: "Read chapters 7-9",
                  checked: false,
                },
              ],
            },
            // Add more tasks here
          ],
        },
        {
          id: "column-3",
          title: "Completed",
          color: "#88B04B",
          boardId: "board-1",
          tasks: [
            {
              id: "task-7",
              title: "Tax Filing",
              description: "File the annual taxes.",
              columnId: "column-3",
              subtasks: [
                { id: "subtask-18", title: "Gather documents", checked: true },
                { id: "subtask-19", title: "Complete forms", checked: true },
                { id: "subtask-20", title: "Submit filing", checked: true },
              ],
            },
            {
              id: "task-8",
              title: "Car Maintenance",
              description: "Get the car serviced.",
              columnId: "column-3",
              subtasks: [
                { id: "subtask-21", title: "Oil change", checked: true },
                { id: "subtask-22", title: "Tire rotation", checked: true },
                { id: "subtask-23", title: "Brake check", checked: true },
              ],
            },
            {
              id: "task-9",
              title: "Vacation Planning",
              description: "Plan the family vacation.",
              columnId: "column-3",
              subtasks: [
                { id: "subtask-24", title: "Book flights", checked: true },
                { id: "subtask-25", title: "Reserve hotel", checked: true },
                { id: "subtask-26", title: "Plan itinerary", checked: true },
              ],
            },
            // Add more tasks here
          ],
        },
      ],
    },
    {
      id: "board-2",
      title: "Work Projects",
      columns: [
        {
          id: "column-4",
          title: "Backlog",
          color: "#F7CAC9",
          boardId: "board-2",
          tasks: [
            {
              id: "task-10",
              title: "Design Website",
              description: "Create the design for the new website.",
              columnId: "column-4",
              subtasks: [
                {
                  id: "subtask-27",
                  title: "Sketch wireframes",
                  checked: false,
                },
                { id: "subtask-28", title: "Create mockups", checked: false },
                { id: "subtask-29", title: "Review with team", checked: false },
              ],
            },
            {
              id: "task-11",
              title: "Client Meeting",
              description:
                "Meet with the client to discuss project requirements.",
              columnId: "column-4",
              subtasks: [
                { id: "subtask-30", title: "Prepare agenda", checked: false },
                { id: "subtask-31", title: "Conduct meeting", checked: false },
                { id: "subtask-32", title: "Follow-up email", checked: false },
              ],
            },
            {
              id: "task-12",
              title: "Market Research",
              description: "Conduct market research for the new product.",
              columnId: "column-4",
              subtasks: [
                {
                  id: "subtask-33",
                  title: "Identify competitors",
                  checked: false,
                },
                { id: "subtask-34", title: "Analyze trends", checked: false },
                { id: "subtask-35", title: "Prepare report", checked: false },
              ],
            },
            // Add more tasks here
          ],
        },
        {
          id: "column-5",
          title: "In Progress",
          color: "#92A8D1",
          boardId: "board-2",
          tasks: [
            {
              id: "task-13",
              title: "Develop Feature A",
              description: "Implement Feature A for the project.",
              columnId: "column-5",
              subtasks: [
                { id: "subtask-36", title: "Write unit tests", checked: true },
                {
                  id: "subtask-37",
                  title: "Develop functionality",
                  checked: false,
                },
                { id: "subtask-38", title: "Code review", checked: false },
              ],
            },
            {
              id: "task-14",
              title: "Bug Fixing",
              description: "Fix bugs reported by the QA team.",
              columnId: "column-5",
              subtasks: [
                { id: "subtask-39", title: "Identify bugs", checked: true },
                { id: "subtask-40", title: "Fix bugs", checked: false },
                { id: "subtask-41", title: "Test fixes", checked: false },
              ],
            },
            {
              id: "task-15",
              title: "Write Documentation",
              description: "Document the project details.",
              columnId: "column-5",
              subtasks: [
                {
                  id: "subtask-42",
                  title: "Outline documentation",
                  checked: true,
                },
                {
                  id: "subtask-43",
                  title: "Write initial draft",
                  checked: false,
                },
                {
                  id: "subtask-44",
                  title: "Review and finalize",
                  checked: false,
                },
              ],
            },
            // Add more tasks here
          ],
        },
        {
          id: "column-6",
          title: "Completed",
          color: "#955251",
          boardId: "board-2",
          tasks: [
            {
              id: "task-16",
              title: "Launch Campaign",
              description: "Launch the marketing campaign.",
              columnId: "column-6",
              subtasks: [
                { id: "subtask-45", title: "Design assets", checked: true },
                { id: "subtask-46", title: "Prepare content", checked: true },
                { id: "subtask-47", title: "Schedule posts", checked: true },
              ],
            },
            {
              id: "task-17",
              title: "Team Training",
              description: "Conduct training sessions for the team.",
              columnId: "column-6",
              subtasks: [
                {
                  id: "subtask-48",
                  title: "Prepare training materials",
                  checked: true,
                },
                { id: "subtask-49", title: "Schedule sessions", checked: true },
                { id: "subtask-50", title: "Conduct sessions", checked: true },
              ],
            },
            {
              id: "task-18",
              title: "User Feedback Analysis",
              description: "Analyze user feedback from the latest release.",
              columnId: "column-6",
              subtasks: [
                { id: "subtask-51", title: "Collect feedback", checked: true },
                { id: "subtask-52", title: "Analyze data", checked: true },
                { id: "subtask-53", title: "Prepare report", checked: true },
              ],
            },
            // Add more tasks here
          ],
        },
      ],
    },
    {
      id: "board-3",
      title: "Hobby Projects",
      columns: [
        {
          id: "column-7",
          title: "Ideas",
          color: "#B565A7",
          boardId: "board-3",
          tasks: [
            {
              id: "task-19",
              title: "Build a Birdhouse",
              description: "Design and build a birdhouse.",
              columnId: "column-7",
              subtasks: [
                { id: "subtask-54", title: "Gather materials", checked: false },
                { id: "subtask-55", title: "Design birdhouse", checked: false },
                {
                  id: "subtask-56",
                  title: "Construct birdhouse",
                  checked: false,
                },
              ],
            },
            {
              id: "task-20",
              title: "Photography",
              description: "Plan a photography session in the park.",
              columnId: "column-7",
              subtasks: [
                {
                  id: "subtask-57",
                  title: "Charge camera batteries",
                  checked: false,
                },
                { id: "subtask-58", title: "Clean lenses", checked: false },
                { id: "subtask-59", title: "Scout locations", checked: false },
              ],
            },
            {
              id: "task-21",
              title: "Write a Blog Post",
              description: "Write and publish a new blog post.",
              columnId: "column-7",
              subtasks: [
                { id: "subtask-60", title: "Choose topic", checked: false },
                { id: "subtask-61", title: "Write draft", checked: false },
                { id: "subtask-62", title: "Publish post", checked: false },
              ],
            },
            // Add more tasks here
          ],
        },
        {
          id: "column-8",
          title: "In Progress",
          color: "#009B77",
          boardId: "board-3",
          tasks: [
            {
              id: "task-22",
              title: "Learn Guitar",
              description: "Practice playing the guitar daily.",
              columnId: "column-8",
              subtasks: [
                { id: "subtask-63", title: "Practice chords", checked: true },
                { id: "subtask-64", title: "Learn new song", checked: false },
                { id: "subtask-65", title: "Record progress", checked: false },
              ],
            },
            {
              id: "task-23",
              title: "Garden Maintenance",
              description: "Maintain the garden regularly.",
              columnId: "column-8",
              subtasks: [
                { id: "subtask-66", title: "Water plants", checked: true },
                { id: "subtask-67", title: "Weed the garden", checked: false },
                { id: "subtask-68", title: "Prune plants", checked: false },
              ],
            },
            {
              id: "task-24",
              title: "Cook New Recipe",
              description: "Try cooking a new recipe from a cookbook.",
              columnId: "column-8",
              subtasks: [
                {
                  id: "subtask-69",
                  title: "Gather ingredients",
                  checked: true,
                },
                { id: "subtask-70", title: "Follow recipe", checked: false },
                { id: "subtask-71", title: "Serve and enjoy", checked: false },
              ],
            },
            // Add more tasks here
          ],
        },
        {
          id: "column-9",
          title: "Completed",
          color: "#DD4124",
          boardId: "board-3",
          tasks: [
            {
              id: "task-25",
              title: "Build a Model Airplane",
              description: "Build and paint a model airplane.",
              columnId: "column-9",
              subtasks: [
                { id: "subtask-72", title: "Assemble parts", checked: true },
                { id: "subtask-73", title: "Paint model", checked: true },
                { id: "subtask-74", title: "Display model", checked: true },
              ],
            },
            {
              id: "task-26",
              title: "Read a Novel",
              description: "Finish reading a novel.",
              columnId: "column-9",
              subtasks: [
                { id: "subtask-75", title: "Read chapters 1-5", checked: true },
                {
                  id: "subtask-76",
                  title: "Read chapters 6-10",
                  checked: true,
                },
                {
                  id: "subtask-77",
                  title: "Read chapters 11-15",
                  checked: true,
                },
              ],
            },
            {
              id: "task-27",
              title: "Organize Closet",
              description: "Organize and declutter the closet.",
              columnId: "column-9",
              subtasks: [
                { id: "subtask-78", title: "Sort clothes", checked: true },
                {
                  id: "subtask-79",
                  title: "Donate unused items",
                  checked: true,
                },
                { id: "subtask-80", title: "Rearrange shelves", checked: true },
              ],
            },
            // Add more tasks here
          ],
        },
      ],
    },
  ],
};

export default defaultData;
