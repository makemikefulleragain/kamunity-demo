// AI Content Engine for generating 10-section Focus Room specifications
// Based on the conversational input and the established template framework

export interface AIPromptContext {
  userChallenge: string;
  targetAudience: string;
  desiredImpact: string;
  approach: string;
}

export interface SpecSection {
  id: string;
  title: string;
  content: string;
  completeness: number;
  required: boolean;
  order: number;
}

export class AIContentEngine {
  private readonly SECTION_TEMPLATES = {
    framing: {
      title: 'Framing & Legitimacy',
      required: true,
      order: 1,
      generator: (context: AIPromptContext) => this.generateFraming(context)
    },
    participants: {
      title: 'Participants & Entry Logic',
      required: true,
      order: 2,
      generator: (context: AIPromptContext) => this.generateParticipants(context)
    },
    blueprint: {
      title: 'Operational Blueprint',
      required: true,
      order: 3,
      generator: (context: AIPromptContext) => this.generateBlueprint(context)
    },
    impact: {
      title: 'Impact & Evidence Framework',
      required: true,
      order: 4,
      generator: (context: AIPromptContext) => this.generateImpact(context)
    },
    theory: {
      title: 'Theory of Change',
      required: false,
      order: 5,
      generator: (context: AIPromptContext) => this.generateTheory(context)
    },
    design: {
      title: 'Room Design & Layout',
      required: true,
      order: 6,
      generator: (context: AIPromptContext) => this.generateDesign(context)
    },
    userflow: {
      title: 'User Flow',
      required: true,
      order: 7,
      generator: (context: AIPromptContext) => this.generateUserFlow(context)
    },
    scalability: {
      title: 'Scalability & Design Options',
      required: false,
      order: 8,
      generator: (context: AIPromptContext) => this.generateScalability(context)
    },
    pilot: {
      title: 'Pilot Plan & Risk Register',
      required: false,
      order: 9,
      generator: (context: AIPromptContext) => this.generatePilot(context)
    },
    glossary: {
      title: 'Glossary',
      required: false,
      order: 10,
      generator: (context: AIPromptContext) => this.generateGlossary(context)
    }
  };

  generateFullSpec(responses: Record<string, any>): SpecSection[] {
    const context: AIPromptContext = {
      userChallenge: responses.challenge || '',
      targetAudience: responses.audience || '',
      desiredImpact: responses.impact || '',
      approach: responses.approach || ''
    };

    return Object.entries(this.SECTION_TEMPLATES).map(([id, template]) => ({
      id,
      title: template.title,
      content: template.generator(context),
      completeness: template.required ? 100 : 80,
      required: template.required,
      order: template.order
    }));
  }

  private generateFraming(context: AIPromptContext): string {
    const focusArea = this.determineFocusArea(context.userChallenge);
    
    return `
**Purpose Statement:** ${context.userChallenge}

**Community Context:** This Focus Room addresses a critical need in our community around ${focusArea.toLowerCase()}. Building on successful local initiatives and community engagement patterns, this space provides a structured environment for collaborative action.

**Why This Matters Now:** ${context.desiredImpact} represents an opportunity for meaningful community impact through coordinated effort and shared resources.

**Legitimacy Foundation:** This room draws from established community organizing principles and successful models of grassroots collaboration, ensuring both effectiveness and community trust.
    `.trim();
  }

  private generateParticipants(context: AIPromptContext): string {
    return `
**Target Participants:** ${context.targetAudience}

**Entry Criteria:** 
- Genuine interest in ${context.userChallenge.toLowerCase()}
- Commitment to collaborative problem-solving
- Willingness to contribute time and expertise
- Alignment with community values of inclusion and respect

**Entry Process:**
1. Initial interest expression through community channels
2. Brief orientation on room purpose and expectations
3. Commitment to participation guidelines
4. Integration into ongoing activities and discussions

**Inclusive Pathways:** Special attention to ensuring diverse voices and perspectives, with multiple entry points for different levels of experience and availability.
    `.trim();
  }

  private generateBlueprint(context: AIPromptContext): string {
    return `
**Typical Session Flow:**
1. **Check-in & Context Setting** (10 minutes)
   - Welcome and introductions
   - Review of previous actions and progress
   - Setting intentions for the session

2. **Core Work** (45-60 minutes)
   - ${context.approach}
   - Collaborative problem-solving
   - Resource sharing and coordination
   - Action planning and commitment

3. **Wrap-up & Next Steps** (15 minutes)
   - Summary of decisions and actions
   - Assignment of responsibilities
   - Scheduling of follow-up activities

**Supporting Tools:**
- Digital collaboration platform for ongoing communication
- Resource library for shared materials and references
- Action tracking system for accountability
- Event coordination for community activities

**ROI Benefits:**
- Reduced duplication of effort across community initiatives
- Increased effectiveness through coordinated action
- Enhanced community connections and social capital
- Measurable progress toward ${context.desiredImpact.toLowerCase()}
    `.trim();
  }

  private generateImpact(context: AIPromptContext): string {
    return `
**Success Indicators:**
- **Participation:** Regular engagement from ${context.targetAudience.toLowerCase()}
- **Action:** Concrete steps taken toward ${context.desiredImpact.toLowerCase()}
- **Community Connection:** Strengthened relationships and collaboration
- **Measurable Outcomes:** Specific, trackable improvements in focus area

**Measurement Methods:**
- Monthly participation tracking
- Quarterly impact assessment surveys
- Annual community outcome evaluation
- Ongoing feedback collection and analysis

**Accountability Framework:**
- Regular progress reports to participants
- Transparent sharing of successes and challenges
- Community input on direction and priorities
- Continuous improvement based on feedback

**Standards Alignment:**
- Community development best practices
- Inclusive participation principles
- Sustainable impact methodologies
- Ethical data collection and privacy protection
    `.trim();
  }

  private generateTheory(context: AIPromptContext): string {
    return `
**Logic Model:**
- **Inputs:** Community members, time, resources, expertise
- **Activities:** ${context.approach.toLowerCase()}, coordination, skill-sharing
- **Outputs:** Regular meetings, shared resources, coordinated actions
- **Outcomes:** ${context.desiredImpact}
- **Impact:** Stronger, more resilient community with enhanced capacity for collective action

**Key Assumptions:**
- Community members have capacity and motivation to participate
- Collaborative approaches are more effective than individual efforts
- Regular engagement builds trust and effectiveness over time
- Shared resources and knowledge amplify individual contributions

**Risk Mitigation:**
- **Participation Fatigue:** Flexible engagement options and regular breaks
- **Scope Creep:** Clear focus and regular priority setting
- **Conflict Management:** Established communication norms and mediation processes
- **Resource Constraints:** Diversified support and sustainable practices
    `.trim();
  }

  private generateDesign(context: AIPromptContext): string {
    const focusArea = this.determineFocusArea(context.userChallenge);
    
    return `
**Digital Space Layout:**
- **Header:** Room title, purpose statement, member count, activity indicators
- **Hero Section:** Current focus, recent achievements, upcoming events
- **Quick Actions:** Join discussion, share resource, schedule meeting, view progress
- **Main Content:** 
  - Left (2/3): Live discussion feed and collaborative workspace
  - Right (1/3): AI assistant with contextual guidance and suggestions
- **Feature Widgets:**
  - Resource library with searchable materials
  - Event calendar with RSVP functionality
  - Progress tracker with visual indicators
  - Member directory with skills and interests
- **Footer:** Feedback mechanism, help resources, community guidelines

**Physical Space Considerations:**
- Flexible seating arrangements for various group sizes
- Technology access for hybrid participation
- Wall space for visual displays and collaborative work
- Accessibility features for diverse physical needs

**Design Principles:**
- Accessibility (WCAG 2.2 AA compliance)
- Mobile-first responsive design
- Clear information hierarchy
- Intuitive navigation and user flows
    `.trim();
  }

  private generateUserFlow(context: AIPromptContext): string {
    return `
**New Member Journey:**
1. **Discovery:** Learn about room through community channels or referrals
2. **Orientation:** Review purpose, guidelines, and current activities
3. **Introduction:** Share background and interests with existing members
4. **Integration:** Participate in discussions and contribute to ongoing work
5. **Engagement:** Take on responsibilities and help guide room direction

**Regular Participation Flow:**
1. **Check Recent Activity:** Review updates and new contributions
2. **Engage in Discussions:** Share insights, ask questions, offer support
3. **Contribute Resources:** Add materials, tools, or expertise to shared library
4. **Coordinate Actions:** Plan events, meetings, or collaborative projects
5. **Track Progress:** Monitor outcomes and celebrate achievements

**Event Participation:**
1. **Event Discovery:** Browse calendar and receive notifications
2. **RSVP Process:** Confirm attendance and indicate any special needs
3. **Pre-Event Preparation:** Access materials and connect with other attendees
4. **Event Participation:** Engage actively in structured activities
5. **Follow-up:** Share reflections and commit to next steps

**Feedback and Improvement:**
- Regular surveys on room effectiveness and satisfaction
- Open channels for suggestions and concerns
- Periodic review and adjustment of processes and focus
- Recognition and celebration of contributions and achievements
    `.trim();
  }

  private generateScalability(context: AIPromptContext): string {
    return `
**MVP Features (Essential):**
- Basic discussion forum
- Resource sharing capability
- Event scheduling
- Member directory
- Progress tracking

**Pro Features (Enhanced):**
- Advanced collaboration tools
- Automated notifications and reminders
- Integration with external platforms
- Detailed analytics and reporting
- Custom branding and theming

**Full Features (Comprehensive):**
- AI-powered insights and recommendations
- Advanced governance and decision-making tools
- Multi-language support
- Enterprise-grade security and compliance
- Professional facilitation and support services

**Scaling Strategy:**
- Start with core group of committed participants
- Gradually expand based on capacity and demand
- Develop leadership pipeline for sustainable growth
- Create replication toolkit for similar communities
- Build network of connected rooms for knowledge sharing

**Resource Requirements by Tier:**
- **MVP:** Volunteer coordination, basic platform access
- **Pro:** Part-time facilitation, enhanced platform features
- **Full:** Professional support, advanced platform capabilities, dedicated resources
    `.trim();
  }

  private generatePilot(context: AIPromptContext): string {
    return `
**Pilot Timeline (12 weeks):**
- **Weeks 1-2:** Setup and initial member recruitment
- **Weeks 3-6:** Regular activities and process refinement
- **Weeks 7-10:** Expanded engagement and outcome tracking
- **Weeks 11-12:** Evaluation and planning for continuation

**Success Metrics:**
- **Participation:** Consistent engagement from at least 60% of members
- **Activity:** Regular contributions and collaborative actions
- **Satisfaction:** Positive feedback from 80%+ of participants
- **Impact:** Measurable progress toward stated goals

**Risk Assessment:**
- **Low Participation:** Mitigation through flexible engagement options
- **Technical Issues:** Backup communication channels and support
- **Scope Drift:** Regular focus reviews and priority setting
- **Sustainability:** Early planning for ongoing resources and leadership

**Resource Needs:**
- **Coordination:** 5-10 hours per week for facilitation and administration
- **Technology:** Platform access and basic technical support
- **Materials:** Initial resources and ongoing content development
- **Space:** Physical meeting location for hybrid activities (if applicable)

**Evaluation Plan:**
- Weekly participation tracking
- Monthly satisfaction surveys
- Quarterly impact assessment
- Final comprehensive evaluation and recommendations
    `.trim();
  }

  private generateGlossary(context: AIPromptContext): string {
    const focusArea = this.determineFocusArea(context.userChallenge);
    
    return `
**Key Terms:**

**Focus Room:** A structured digital and/or physical space designed for collaborative community action around a specific challenge or opportunity.

**Community Impact:** Measurable positive changes in community wellbeing, capacity, or conditions resulting from collective action.

**Collaborative Action:** Coordinated efforts by community members working together toward shared goals with distributed leadership and shared resources.

**Participant:** Community member actively engaged in room activities, discussions, and collaborative efforts.

**Resource Library:** Curated collection of materials, tools, templates, and references relevant to the room's focus area.

**Progress Tracking:** Systematic monitoring and documentation of activities, outcomes, and impact toward stated goals.

**${focusArea} Focus:** The specific area of community challenge or opportunity that defines the room's purpose and activities.

**Inclusive Participation:** Practices and structures designed to ensure diverse voices, perspectives, and levels of engagement are welcomed and supported.

**Sustainable Practices:** Approaches to room operation and community action that can be maintained over time without depleting resources or burning out participants.

**Community Guidelines:** Agreed-upon norms and expectations for respectful, productive interaction and collaboration within the room.
    `.trim();
  }

  private determineFocusArea(challenge: string): string {
    const keywords = challenge.toLowerCase();
    
    if (keywords.includes('environment') || keywords.includes('climate') || keywords.includes('sustainability')) {
      return 'Environmental Action';
    } else if (keywords.includes('education') || keywords.includes('learning') || keywords.includes('school')) {
      return 'Education & Learning';
    } else if (keywords.includes('health') || keywords.includes('wellness') || keywords.includes('mental')) {
      return 'Health & Wellness';
    } else if (keywords.includes('housing') || keywords.includes('development') || keywords.includes('planning')) {
      return 'Community Development';
    } else if (keywords.includes('justice') || keywords.includes('equity') || keywords.includes('rights')) {
      return 'Social Justice';
    } else if (keywords.includes('arts') || keywords.includes('culture') || keywords.includes('creative')) {
      return 'Arts & Culture';
    } else if (keywords.includes('business') || keywords.includes('economic') || keywords.includes('jobs')) {
      return 'Economic Development';
    } else if (keywords.includes('government') || keywords.includes('policy') || keywords.includes('civic')) {
      return 'Local Government';
    } else {
      return 'Community Building';
    }
  }
}
