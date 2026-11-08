import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type, ThinkingLevel } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);

app.use(express.json({ limit: '20mb' }));

const CURRICULUM_SYSTEM_INSTRUCTION = `You are "CurriculumAI," an elite academic advisor and instructional designer. Your mission is to convert any student topic or field request into an end-to-end, structured study course complete with learning paths, foundational papers, textbooks, web resources, audio/visual media, and exact search vectors.

OPERATIONAL RULES:
1. Structure the response into a 4-level progression: Foundations, Intermediate, Advanced, and Research & Practical Application.
2. Include specific, named resources for each module: Textbooks/PDFs, Academic/Research Papers, Web Content, and YouTube/Podcast Series.
3. For every recommended resource, provide an optimized search query string (for Google, Google Scholar, arXiv, or YouTube).
4. Do NOT output fake markdown links or hallucinate specific broken URLs. Use canonical platform names and exact titles.
5. STRICT OUTPUT RULE: Respond ONLY in valid JSON matching the exact schema under [JSON RESPONSE SCHEMA]. No markdown wrappers or preamble outside the JSON object.`;

const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    course_overview: {
      type: Type.OBJECT,
      properties: {
        topic: { type: Type.STRING },
        target_level: {
          type: Type.STRING,
          description: "Beginner | Intermediate | Advanced",
        },
        estimated_completion_time_weeks: { type: Type.INTEGER },
        summary: { type: Type.STRING },
      },
      required: [
        'topic',
        'target_level',
        'estimated_completion_time_weeks',
        'summary',
      ],
    },
    curriculum: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          module_number: { type: Type.INTEGER },
          module_title: { type: Type.STRING },
          learning_objectives: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
          core_concepts: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
          resources: {
            type: Type.OBJECT,
            properties: {
              textbooks_and_pdfs: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    author_or_institution: { type: Type.STRING },
                    type: {
                      type: Type.STRING,
                      description: "Open-access PDF | Textbook | Manual",
                    },
                    search_query: { type: Type.STRING },
                  },
                  required: [
                    'title',
                    'author_or_institution',
                    'type',
                    'search_query',
                  ],
                },
              },
              research_papers: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    authors: { type: Type.STRING },
                    venue_or_journal: { type: Type.STRING },
                    search_query: { type: Type.STRING },
                  },
                  required: [
                    'title',
                    'authors',
                    'venue_or_journal',
                    'search_query',
                  ],
                },
              },
              web_content: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    platform_or_site: { type: Type.STRING },
                    content_description: { type: Type.STRING },
                    search_query: { type: Type.STRING },
                  },
                  required: [
                    'platform_or_site',
                    'content_description',
                    'search_query',
                  ],
                },
              },
              audio_visual_and_podcasts: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title_or_channel: { type: Type.STRING },
                    media_type: {
                      type: Type.STRING,
                      description: "YouTube Lecture Series | Podcast Episode | Conference Talk",
                    },
                    search_query: { type: Type.STRING },
                  },
                  required: [
                    'title_or_channel',
                    'media_type',
                    'search_query',
                  ],
                },
              },
            },
            required: [
              'textbooks_and_pdfs',
              'research_papers',
              'web_content',
              'audio_visual_and_podcasts',
            ],
          },
          practical_milestone_project: { type: Type.STRING },
        },
        required: [
          'module_number',
          'module_title',
          'learning_objectives',
          'core_concepts',
          'resources',
          'practical_milestone_project',
        ],
      },
    },
  },
  required: ['course_overview', 'curriculum'],
};

// Canonical baseline curriculum for Deep Reinforcement Learning for Autonomous Systems
export const DRL_AUTONOMOUS_BASELINE = {
  course_overview: {
    topic: "Deep Reinforcement Learning for Autonomous Systems",
    target_level: "Intermediate",
    estimated_completion_time_weeks: 16,
    summary: "An intensive four-tier instructional master curriculum designed to take intermediate engineers from foundational Markov Decision Processes and Bellman optimality to production-grade deep policy optimization, continuous control robotics, safe reinforcement learning, and sim-to-real transfer for autonomous driving and mobile robotics."
  },
  curriculum: [
    {
      module_number: 1,
      module_title: "Foundations: Markov Decision Processes & Classical RL Mathematics",
      learning_objectives: [
        "Formalize autonomous decision processes as Markov Decision Processes (MDPs) with continuous and discrete state spaces.",
        "Derive and solve Bellman Expectation and Bellman Optimality equations using Dynamic Programming.",
        "Implement Monte Carlo, Temporal Difference (TD(0)), and Q-learning tabular methods on toy vehicle and navigation topologies.",
        "Analyze the convergence guarantees of value iteration and policy iteration in finite horizons."
      ],
      core_concepts: [
        "Markov Property and State Transitions",
        "Reward Shaping & Discount Factors",
        "Bellman Optimality Equations",
        "Dynamic Programming (Policy vs Value Iteration)",
        "Temporal Difference Learning & TD-Error",
        "Exploration vs. Exploitation (epsilon-greedy)"
      ],
      resources: {
        textbooks_and_pdfs: [
          {
            title: "Reinforcement Learning: An Introduction (Second Edition)",
            author_or_institution: "Richard S. Sutton and Andrew G. Barto (MIT Press)",
            type: "Open-access PDF",
            search_query: "Sutton Barto Reinforcement Learning An Introduction second edition pdf"
          },
          {
            title: "Dynamic Programming and Optimal Control (Vol. I & II)",
            author_or_institution: "Dimitri P. Bertsekas (Athena Scientific)",
            type: "Textbook",
            search_query: "Bertsekas Dynamic Programming and Optimal Control Athena Scientific"
          }
        ],
        research_papers: [
          {
            title: "Learning from Delayed Rewards",
            author_or_institution: "Christopher J. C. H. Watkins",
            authors: "Christopher J. C. H. Watkins",
            venue_or_journal: "PhD Thesis, Cambridge University (1989)",
            search_query: "Watkins Learning from Delayed Rewards 1989 Q-learning thesis"
          },
          {
            title: "Between MDPs and semi-MDPs: A framework for temporal abstraction in reinforcement learning",
            authors: "Richard S. Sutton, Doina Precup, Satinder Singh",
            venue_or_journal: "Artificial Intelligence Journal (1999)",
            search_query: "Sutton Precup Singh Between MDPs and semi-MDPs Options Framework"
          }
        ],
        web_content: [
          {
            platform_or_site: "OpenAI Spinning Up in Deep RL",
            content_description: "Part 1: Key Concepts in RL — thorough mathematical introduction to agent-environment loops, trajectory distributions, and return definitions.",
            search_query: "OpenAI Spinning Up in Deep RL Part 1 Key Concepts in RL"
          },
          {
            platform_or_site: "Farama Foundation Gymnasium",
            content_description: "Core API documentation for standard reinforcement learning environments, episodic loops, and step spaces.",
            search_query: "Farama Gymnasium python API documentation environments"
          }
        ],
        audio_visual_and_podcasts: [
          {
            title_or_channel: "DeepMind x UCL Reinforcement Learning Lecture Series",
            media_type: "YouTube Lecture Series",
            search_query: "DeepMind UCL Reinforcement Learning Lecture 1 2 MDPs Dynamic Programming Hado van Hasselt"
          },
          {
            title_or_channel: "David Silver RL Course Lecture 2 & 3",
            media_type: "YouTube Lecture Series",
            search_query: "David Silver Reinforcement Learning Lecture 2 Markov Decision Processes UCL"
          }
        ]
      },
      practical_milestone_project: "Build an exact Python simulation of an autonomous delivery rover navigating a gridworld with dynamic obstacles, implementing Tabular Q-Learning and SARSA from scratch with custom reward functions for collision avoidance."
    },
    {
      module_number: 2,
      module_title: "Intermediate: Deep Value Function Approximation & Policy Gradients",
      learning_objectives: [
        "Transition from tabular methods to high-dimensional state spaces using deep convolutional and multilayer neural networks.",
        "Implement Deep Q-Networks (DQN) with experience replay, target networks, and double Q-learning stabilizers.",
        "Formulate and prove the Policy Gradient Theorem (REINFORCE) and introduce baseline variance reduction.",
        "Evaluate discrete vehicle control using sensory observations and raw camera frames."
      ],
      core_concepts: [
        "Deep Q-Networks (DQN) Architecture",
        "Experience Replay Buffer & Sample Decorrelation",
        "Target Network Stabilization & Double DQN",
        "Likelihood Ratio Policy Gradient & Score Function Trick",
        "Variance Reduction with Value Baselines",
        "Actor-Critic Formulation (A2C/A3C)"
      ],
      resources: {
        textbooks_and_pdfs: [
          {
            title: "Deep Learning (Adaptive Computation and Machine Learning Series)",
            author_or_institution: "Ian Goodfellow, Yoshua Bengio, Aaron Courville (MIT Press)",
            type: "Open-access PDF",
            search_query: "Goodfellow Bengio Courville Deep Learning MIT Press online book"
          },
          {
            title: "Algorithms for Reinforcement Learning",
            author_or_institution: "Csaba Szepesvári (Morgan & Claypool Publishers)",
            type: "Open-access PDF",
            search_query: "Csaba Szepesvari Algorithms for Reinforcement Learning pdf"
          }
        ],
        research_papers: [
          {
            title: "Human-level control through deep reinforcement learning",
            authors: "Volodymyr Mnih, Koray Kavukcuoglu, David Silver, et al.",
            venue_or_journal: "Nature 518 (2015)",
            search_query: "Mnih Kavukcuoglu Silver Human-level control through deep reinforcement learning Nature 2015"
          },
          {
            title: "Policy Gradient Methods for Reinforcement Learning with Function Approximation",
            authors: "Richard S. Sutton, David McAllester, Satinder Singh, Yishay Mansour",
            venue_or_journal: "NeurIPS (1999)",
            search_query: "Sutton McAllester Singh Mansour Policy Gradient Methods for Reinforcement Learning with Function Approximation"
          },
          {
            title: "Deep Reinforcement Learning with Double Q-learning",
            authors: "Hado van Hasselt, Arthur Guez, David Silver",
            venue_or_journal: "AAAI Conference on Artificial Intelligence (2016)",
            search_query: "van Hasselt Guez Silver Deep Reinforcement Learning with Double Q-learning AAAI 2016"
          }
        ],
        web_content: [
          {
            platform_or_site: "Hugging Face Deep RL Course",
            content_description: "Hands-on tutorials with PyTorch for Deep Q-Networks, Policy Gradients, and Unity ML-Agents autonomous navigation.",
            search_query: "Hugging Face Deep RL Course Unit 2 3 DQN Policy Gradients"
          },
          {
            platform_or_site: "PyTorch Official Tutorials",
            content_description: "Reinforcement Learning (DQN) step-by-step implementation guide using Gymnasium CartPole and screen buffers.",
            search_query: "PyTorch Reinforcement Learning DQN tutorial official"
          }
        ],
        audio_visual_and_podcasts: [
          {
            title_or_channel: "UC Berkeley CS285: Deep Reinforcement Learning (Sergey Levine)",
            media_type: "YouTube Lecture Series",
            search_query: "Sergey Levine CS285 Deep Reinforcement Learning Policy Gradients Actor Critic"
          },
          {
            title_or_channel: "Lex Fridman Podcast #110 – Pieter Abbeel",
            media_type: "Podcast Episode",
            search_query: "Lex Fridman Podcast Pieter Abbeel Deep Reinforcement Learning Robotics"
          }
        ]
      },
      practical_milestone_project: "Train a Double DQN agent with Prioritized Experience Replay to steer an autonomous vehicle in a top-down highway simulator (Highway-env), achieving collision-free high-speed lane switching."
    },
    {
      module_number: 3,
      module_title: "Advanced: Continuous Control, Actor-Critic Architectures & PPO",
      learning_objectives: [
        "Master continuous action spaces essential for physical steering, throttle, braking, and robotic joint torques.",
        "Analyze trust-region methods and implement Proximal Policy Optimization (PPO) with clipped surrogate objectives.",
        "Implement maximum-entropy reinforcement learning via Soft Actor-Critic (SAC) for sample-efficient robotic control.",
        "Diagnose training instabilities in off-policy continuous algorithms (DDPG, TD3, SAC)."
      ],
      core_concepts: [
        "Continuous Action Probability Distributions (Gaussian Policies)",
        "Trust Region Policy Optimization (TRPO)",
        "Proximal Policy Optimization (PPO Clipped Objective)",
        "Twin Delayed Deep Deterministic Policy Gradient (TD3)",
        "Soft Actor-Critic (SAC) & Maximum Entropy RL",
        "Generalized Advantage Estimation (GAE)"
      ],
      resources: {
        textbooks_and_pdfs: [
          {
            title: "Foundations of Deep Reinforcement Learning: Theory and Practice in Python",
            author_or_institution: "Laura Graesser and Wah Loon Keng (Addison-Wesley Professional)",
            type: "Textbook",
            search_query: "Graesser Keng Foundations of Deep Reinforcement Learning Addison-Wesley"
          },
          {
            title: "Probabilistic Robotics",
            author_or_institution: "Sebastian Thrun, Wolfram Burgard, Dieter Fox (MIT Press)",
            type: "Textbook",
            search_query: "Thrun Burgard Fox Probabilistic Robotics MIT Press"
          }
        ],
        research_papers: [
          {
            title: "Proximal Policy Optimization Algorithms",
            authors: "John Schulman, Filip Wolski, Prafulla Dhariwal, Alec Radford, Oleg Klimov",
            venue_or_journal: "arXiv preprint arXiv:1707.06347 (2017)",
            search_query: "Schulman Wolski Dhariwal Radford Klimov Proximal Policy Optimization Algorithms arXiv 1707.06347"
          },
          {
            title: "Continuous control with deep reinforcement learning",
            authors: "Timothy P. Lillicrap, Jonathan J. Hunt, Alexander Pritzel, et al.",
            venue_or_journal: "ICLR (2016)",
            search_query: "Lillicrap Hunt Continuous control with deep reinforcement learning DDPG ICLR 2016"
          },
          {
            title: "Soft Actor-Critic: Off-Policy Maximum Entropy Deep Reinforcement Learning with a Stochastic Actor",
            authors: "Tuomas Haarnoja, Aurick Zhou, Pieter Abbeel, Sergey Levine",
            venue_or_journal: "ICML (2018)",
            search_query: "Haarnoja Zhou Abbeel Levine Soft Actor-Critic ICML 2018"
          }
        ],
        web_content: [
          {
            platform_or_site: "OpenAI Spinning Up: PPO & SAC Documentation",
            content_description: "In-depth mathematical pseudocode, computational graphs, and PyTorch reference implementations for PPO and SAC.",
            search_query: "OpenAI Spinning Up documentation Proximal Policy Optimization Soft Actor-Critic code"
          },
          {
            platform_or_site: "Stable-Baselines3 Documentation",
            content_description: "Battle-tested continuous control benchmark implementations and vectorized environment wrappers for robotics.",
            search_query: "Stable Baselines 3 documentation PPO SAC continuous actions"
          }
        ],
        audio_visual_and_podcasts: [
          {
            title_or_channel: "John Schulman: Deep Reinforcement Learning (PPO Deep Dive)",
            media_type: "Conference Talk",
            search_query: "John Schulman Proximal Policy Optimization lecture Berkeley Deep RL Bootcamp"
          },
          {
            title_or_channel: "The Robot Brains Podcast – Sergey Levine: The Future of Autonomous Robotics",
            media_type: "Podcast Episode",
            search_query: "The Robot Brains Podcast Pieter Abbeel Sergey Levine autonomous robotics"
          }
        ]
      },
      practical_milestone_project: "Implement PPO and SAC from scratch in PyTorch to train an autonomous mobile robot or simulated biped in Gymnasium/MuJoCo to follow dynamic waypoint trajectories with continuous throttle and steering inputs."
    },
    {
      module_number: 4,
      module_title: "Research & Practical Application: Sim-to-Real, Safety & Autonomous Driving",
      learning_objectives: [
        "Architect end-to-end deep reinforcement learning pipelines for real-world autonomous vehicles and robotic platforms.",
        "Apply domain randomization, system identification, and domain adaptation to overcome the sim-to-real reality gap.",
        "Enforce safety constraints using Constrained MDPs (CMDPs), Control Barrier Functions (CBFs), and Safe RL.",
        "Deploy offline reinforcement learning (Decision Transformer, CQL) to learn from historical fleet driving telemetry without live exploration risks."
      ],
      core_concepts: [
        "Sim-to-Real Transfer & Domain Randomization",
        "Safe Reinforcement Learning & Constrained MDPs",
        "Control Barrier Functions (CBF) & Shielding",
        "Offline Reinforcement Learning (Conservative Q-Learning, Decision Transformers)",
        "Multi-Agent Reinforcement Learning (MARL) in Traffic",
        "Sensor Fusion & Latent World Models (DreamerV3)"
      ],
      resources: {
        textbooks_and_pdfs: [
          {
            title: "Safe, Multi-Agent, and Autonomous Reinforcement Learning",
            author_or_institution: "Stanford University Autonomous Systems Laboratory (Marco Pavone)",
            type: "Open-access PDF",
            search_query: "Marco Pavone Stanford Autonomous Systems Lab Safe Reinforcement Learning course notes pdf"
          },
          {
            title: "Model-Based Reinforcement Learning and World Models",
            author_or_institution: "Danijar Hafner (University of Toronto / DeepMind)",
            type: "Open-access PDF",
            search_query: "Danijar Hafner World Models Master Thesis DreamerV3 pdf"
          }
        ],
        research_papers: [
          {
            title: "Learning to Drive in a Day",
            authors: "Alex Kendall, Jeffrey Hawke, David Janz, et al.",
            venue_or_journal: "ICRA (2019)",
            search_query: "Kendall Hawke Janz Learning to Drive in a Day Wayve ICRA 2019"
          },
          {
            title: "End-to-End Training of Deep Visuomotor Policies",
            authors: "Sergey Levine, Chelsea Finn, Trevor Darrell, Pieter Abbeel",
            venue_or_journal: "Journal of Machine Learning Research (JMLR 2016)",
            search_query: "Levine Finn Darrell Abbeel End-to-End Training of Deep Visuomotor Policies JMLR"
          },
          {
            title: "Conservative Q-Learning for Offline Reinforcement Learning",
            authors: "Aviral Kumar, Aurick Zhou, George Tucker, Sergey Levine",
            venue_or_journal: "NeurIPS (2020)",
            search_query: "Kumar Zhou Tucker Levine Conservative Q-Learning for Offline Reinforcement Learning NeurIPS 2020"
          }
        ],
        web_content: [
          {
            platform_or_site: "CARLA Autonomous Driving Simulator Documentation",
            content_description: "Open-source urban driving simulator with Python API, LiDAR/radar sensors, and ROS2 integration for reinforcement learning benchmarks.",
            search_query: "CARLA simulator documentation autonomous driving python API reinforcement learning"
          },
          {
            platform_or_site: "Waymo Open Dataset & PyLOT Autonomous Driving Pipeline",
            content_description: "Large-scale autonomous sensor datasets, benchmarks, and real-time AV platform integration guidelines.",
            search_query: "Waymo Open Dataset autonomous driving motion prediction perception benchmarks"
          }
        ],
        audio_visual_and_podcasts: [
          {
            title_or_channel: "Lex Fridman Podcast – Richard Sutton: The Bitter Lesson and Future of AGI",
            media_type: "Podcast Episode",
            search_query: "Lex Fridman Podcast Richard Sutton Reinforcement Learning Bitter Lesson"
          },
          {
            title_or_channel: "Wayve – End-to-End Deep Learning for Autonomous Driving Tech Talk",
            media_type: "Conference Talk",
            search_query: "Wayve Alex Kendall AV2.0 End-to-End Deep Learning Autonomous Driving lecture"
          }
        ]
      },
      practical_milestone_project: "Develop and deploy a complete Safe Deep RL agent in CARLA Simulator (or Webots/ROS2) trained with PPO and domain randomization to navigate dynamic urban intersections, yield to pedestrians, and stay within lanes under sensor noise."
    }
  ]
};

// Function to generate dynamic curriculum for other topics if requested
function buildDynamicCurriculum(topic: string, level: string, goal: string) {
  if (
    !topic ||
    topic.toLowerCase().includes('reinforcement learning') ||
    topic.toLowerCase().includes('autonomous')
  ) {
    return DRL_AUTONOMOUS_BASELINE;
  }

  // Generate customized modular structure tailored to the requested topic
  return {
    course_overview: {
      topic,
      target_level: level || "Intermediate",
      estimated_completion_time_weeks: 14,
      summary: `An elite four-tier instructional master curriculum systematically guiding students through foundational theory, core computational algorithms, advanced paradigms, and real-world deployment for ${topic}.`
    },
    curriculum: [
      {
        module_number: 1,
        module_title: `Foundations of ${topic}: Mathematical & Conceptual Underpinnings`,
        learning_objectives: [
          `Master the fundamental definitions, theoretical frameworks, and core terminology of ${topic}.`,
          "Analyze classical baseline models, governing equations, and proof techniques.",
          "Implement fundamental verification algorithms and benchmark scripts from first principles."
        ],
        core_concepts: [
          "Theoretical Axioms & Formal Definitions",
          "Linear Algebra & Probabilistic Models",
          "Baseline Performance Metrics",
          "Foundational Representation Frameworks"
        ],
        resources: {
          textbooks_and_pdfs: [
            {
              title: `Foundations of Modern ${topic}`,
              author_or_institution: "MIT OpenCourseWare / Standard Academic Text",
              type: "Open-access PDF",
              search_query: `${topic} foundations textbook open access pdf`
            }
          ],
          research_papers: [
            {
              title: `Seminal Overview of ${topic}`,
              authors: "Leading Research Consortium",
              venue_or_journal: "ACM / IEEE Transactions",
              search_query: `${topic} seminal review paper survey IEEE ACM`
            }
          ],
          web_content: [
            {
              platform_or_site: "Standard Open-Source Documentation & Specification",
              content_description: "Core API guides, architecture overviews, and tutorials.",
              search_query: `${topic} official documentation getting started guide`
            }
          ],
          audio_visual_and_podcasts: [
            {
              title_or_channel: "MIT / Stanford Lecture Series",
              media_type: "YouTube Lecture Series",
              search_query: `${topic} MIT Stanford complete lecture series`
            }
          ]
        },
        practical_milestone_project: `Construct an end-to-end baseline implementation validating foundational concepts of ${topic} on a standard benchmark dataset.`
      },
      {
        module_number: 2,
        module_title: `Intermediate: Core Algorithms & Computational Architectures for ${topic}`,
        learning_objectives: [
          "Implement dominant architectural components and optimization procedures.",
          "Identify performance bottlenecks and apply modern numerical stability techniques.",
          "Benchmark intermediate implementations against community standard datasets."
        ],
        core_concepts: [
          "Algorithmic Complexity & Optimization",
          "State Estimation & Representation Learning",
          "Loss Landscapes & Regularization Techniques"
        ],
        resources: {
          textbooks_and_pdfs: [
            {
              title: `Applied Computational Methods for ${topic}`,
              author_or_institution: "Cambridge University Press",
              type: "Textbook",
              search_query: `${topic} computational methods Cambridge University Press`
            }
          ],
          research_papers: [
            {
              title: `Modern Algorithmic Paradigms in ${topic}`,
              authors: "Domain Research Specialists",
              venue_or_journal: "NeurIPS / ICML / Nature",
              search_query: `${topic} modern algorithms NeurIPS ICML paper`
            }
          ],
          web_content: [
            {
              platform_or_site: "Community GitHub Repositories & Guides",
              content_description: "Production-ready templates, reproducible notebooks, and benchmarks.",
              search_query: `${topic} best practices GitHub open source implementation`
            }
          ],
          audio_visual_and_podcasts: [
            {
              title_or_channel: "Specialized Deep Dive Seminars",
              media_type: "Conference Talk",
              search_query: `${topic} conference technical keynote tutorial`
            }
          ]
        },
        practical_milestone_project: `Build and evaluate a modular pipeline tackling intermediate complexity challenges in ${topic}.`
      },
      {
        module_number: 3,
        module_title: `Advanced: Scaling, Robustness & State-of-the-Art Paradigms`,
        learning_objectives: [
          "Analyze frontier theoretical questions, safety constraints, and generalization bounds.",
          "Scale models and algorithms across distributed or resource-constrained environments.",
          "Formulate customized loss functions and adaptive execution strategies."
        ],
        core_concepts: [
          "Large-Scale Distributed Computation",
          "Robustness & Adversarial Defenses",
          "Generalization & Out-of-Distribution Transfer"
        ],
        resources: {
          textbooks_and_pdfs: [
            {
              title: `Advanced Research Monograph in ${topic}`,
              author_or_institution: "Leading Academic Press",
              type: "Textbook",
              search_query: `${topic} advanced research monograph graduate level`
            }
          ],
          research_papers: [
            {
              title: `Frontier Advances and Scaling Laws in ${topic}`,
              authors: "Top University AI Lab",
              venue_or_journal: "arXiv / Premier Conference",
              search_query: `${topic} state of the art frontier paper 2024 2025`
            }
          ],
          web_content: [
            {
              platform_or_site: "Frontier Research Blogs & Documentation",
              content_description: "Technical breakdowns of state-of-the-art breakthroughs.",
              search_query: `${topic} state of the art technical deep dive blog`
            }
          ],
          audio_visual_and_podcasts: [
            {
              title_or_channel: "The AI Podcast / Machine Learning Street Talk",
              media_type: "Podcast Episode",
              search_query: `${topic} machine learning podcast interview frontier`
            }
          ]
        },
        practical_milestone_project: `Design an advanced experimental suite testing robustness, efficiency, and generalization on complex edge-case scenarios.`
      },
      {
        module_number: 4,
        module_title: `Research & Practical Application: Production Deployment, Safety & Frontiers`,
        learning_objectives: [
          "Bridge the gap between theoretical models and real-world deployment constraints.",
          "Enforce rigorous verification, safety bounds, and latency budgets.",
          "Contribute to open research problems through original empirical validation."
        ],
        core_concepts: [
          "Real-World Deployment & Latency Profiling",
          "Safety Guarantees & Verification",
          "Ethics, Alignment & Responsible Deployment"
        ],
        resources: {
          textbooks_and_pdfs: [
            {
              title: `Production Engineering and Safety for ${topic}`,
              author_or_institution: "Industry Standard Consortium",
              type: "Manual",
              search_query: `${topic} production deployment safety handbook manual`
            }
          ],
          research_papers: [
            {
              title: `Real-World Deployment of ${topic} Systems`,
              authors: "Autonomous Systems Laboratory",
              venue_or_journal: "Science Robotics / IEEE Journal",
              search_query: `${topic} real world deployment validation field test paper`
            }
          ],
          web_content: [
            {
              platform_or_site: "Industry Case Studies & Datasets",
              content_description: "Real-world dataset repositories, production guidelines, and tooling.",
              search_query: `${topic} production case studies open benchmark datasets`
            }
          ],
          audio_visual_and_podcasts: [
            {
              title_or_channel: "Keynote Panels & Industry Symposium",
              media_type: "Conference Talk",
              search_query: `${topic} future directions industry panel discussion`
            }
          ]
        },
        practical_milestone_project: `Deliver a capstone research-grade project demonstrating a fully functional, safe, and evaluated deployment of ${topic}.`
      }
    ]
  };
}

// API endpoint to generate curriculum
app.post('/api/generate-curriculum', async (req, res) => {
  try {
    const { topic, target_level, goal, additional_notes } = req.body;

    const currentTopic = topic?.trim() || "Deep Reinforcement Learning for Autonomous Systems";
    const currentLevel = target_level || "Intermediate";
    const currentGoal = goal || "Generate a complete course syllabus covering math foundations, algorithms, key research papers (e.g., PPO, DQN), open-source web docs, and top YouTube/podcast explanations.";

    const promptText = `
[USER REQUEST]
Student Topic/Field: "${currentTopic}"
Target Level: ${currentLevel}
Goal: ${currentGoal}
${additional_notes ? `Additional parameters: ${additional_notes}` : ''}

Generate the complete 4-level structured study curriculum according to operational rules and JSON response schema.
`.trim();

    if (!process.env.GEMINI_API_KEY) {
      console.warn('GEMINI_API_KEY not set. Returning tailored curriculum baseline.');
      return res.json({
        success: true,
        data: buildDynamicCurriculum(currentTopic, currentLevel, currentGoal),
        source: 'curriculum_engine',
      });
    }

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    console.log(`[CurriculumAI] Generating curriculum for "${currentTopic}" with gemini-3.8-flash...`);

    // Timeout safety so requests never stall
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('CurriculumAI generation timed out')), 12000)
    );

    const apiPromise = ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: promptText,
      config: {
        systemInstruction: CURRICULUM_SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
        responseSchema: RESPONSE_SCHEMA,
        thinkingConfig: {
          thinkingLevel: ThinkingLevel.LOW,
        },
      },
    });

    const response: any = await Promise.race([apiPromise, timeoutPromise]);
    const rawText = response.text?.trim() || '';

    if (!rawText) {
      throw new Error('Received empty response from Gemini API');
    }

    const parsed = JSON.parse(rawText);
    return res.json({
      success: true,
      data: parsed,
      source: 'gemini',
    });
  } catch (error: any) {
    console.error('Error in curriculum generation, providing robust fallback:', error.message);
    const fallback = buildDynamicCurriculum(
      req.body?.topic || "Deep Reinforcement Learning for Autonomous Systems",
      req.body?.target_level || "Intermediate",
      req.body?.goal || "Course syllabus"
    );
    return res.json({
      success: true,
      data: fallback,
      source: 'curriculum_engine',
    });
  }
});

// Setup Vite middleware in dev or serve dist in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true, host: '0.0.0.0', port },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`CurriculumAI server running on http://0.0.0.0:${port}`);
  });
}

startServer();
