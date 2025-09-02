"use strict";(()=>{var e={};e.id=1086,e.ids=[1086],e.modules={20399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},19102:(e,o,t)=>{t.r(o),t.d(o,{originalPathname:()=>h,patchFetch:()=>v,requestAsyncStorage:()=>g,routeModule:()=>c,serverHooks:()=>y,staticGenerationAsyncStorage:()=>u});var i={};t.r(i),t.d(i,{POST:()=>l});var r=t(49303),s=t(88716),a=t(60670),n=t(87070);async function l(e){try{let o=await e.json();if(!o.roomName||!o.primaryGoal)return n.NextResponse.json({success:!1,message:"Room name and primary goal are required"},{status:400});let t=process.env.EMAILJS_SERVICE_ID&&process.env.EMAILJS_TEMPLATE_ID&&process.env.EMAILJS_USER_ID,i=function(e){let o=e.timeCommitment.includes("daily")?"day":"week",t=`
**A ${o} in the life of your ${e.roomName}:**

**Morning (9:00 AM):** Sarah logs into her ${e.roomName} and sees 3 new updates from overnight. The AI assistant has already summarized key discussions and highlighted 2 action items that need her attention.

**Mid-Morning (10:30 AM):** The weekly check-in begins. 12 members join the video call, with 8 more participating asynchronously. The AI facilitates by tracking speaking time and suggesting agenda items based on recent activity.

**Afternoon (2:00 PM):** A breakthrough moment! The collaborative workspace shows real progress on ${e.primaryGoal}. Members vote on next steps using the integrated decision-making tools.

**Evening (6:00 PM):** Impact achieved! The room's dashboard shows measurable progress: ${e.successMetrics.slice(0,2).join(" and ")}. Members celebrate and plan the next milestone.

**Result:** What used to take 3 separate meetings and countless emails now happens seamlessly in one integrated space, saving 5+ hours per week while achieving better outcomes.
  `;return{roomOverview:{name:e.roomName,goal:e.primaryGoal,audience:e.targetAudience,commitment:e.timeCommitment,features:e.keyFeatures,metrics:e.successMetrics},roiAnalysis:{weekly:2625,monthly:10500,yearly:126e3,memberCount:15,hoursSaved:5},dayInTheLife:t,implementationPlan:{phase1:"Setup & Onboarding (Week 1-2)",phase2:"Community Building (Week 3-6)",phase3:"Full Operations (Week 7+)"}}}(o),r="skipped";if(t)try{await d(o,i),o.email&&(await m(o,i),r="sent")}catch(e){console.error("Email sending failed:",e),r="failed"}else console.warn("Email service not configured - skipping email notifications");return n.NextResponse.json({success:!0,message:"Focus Room spec sheet generated successfully",emailStatus:r,specSheet:i})}catch(o){console.error("Focus Room generation error:",o);let e=o instanceof Error?o.message:"Unknown error occurred";return n.NextResponse.json({success:!1,message:"Failed to generate Focus Room spec sheet",error:e,timestamp:new Date().toISOString()},{status:500})}}async function d(e,o){let t=`
    <h2>New Focus Room Generated</h2>
    <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
    
    <h3>Room Details</h3>
    <ul>
      <li><strong>Room Name:</strong> ${e.roomName}</li>
      <li><strong>Primary Goal:</strong> ${e.primaryGoal}</li>
      <li><strong>Target Audience:</strong> ${e.targetAudience}</li>
      <li><strong>Time Commitment:</strong> ${e.timeCommitment}</li>
      <li><strong>Key Features:</strong> ${e.keyFeatures.join(", ")}</li>
      <li><strong>Success Metrics:</strong> ${e.successMetrics.join(", ")}</li>
      <li><strong>User Email:</strong> ${e.email||"Not provided"}</li>
    </ul>

    <h3>ROI Analysis</h3>
    <ul>
      <li><strong>Projected Annual Value:</strong> $${o.roiAnalysis.yearly.toLocaleString()}</li>
      <li><strong>Members:</strong> ${o.roiAnalysis.memberCount}</li>
      <li><strong>Hours Saved/Week:</strong> ${o.roiAnalysis.hoursSaved} per member</li>
    </ul>
  `;await p({to:"mike@kamunityconsulting.com",subject:`New Focus Room: ${e.roomName}`,html:t})}async function m(e,o){let t=`
    <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #0ea5e9; margin-bottom: 10px;">Your Focus Room Specification 🎯</h1>
        <p style="color: #666; font-size: 18px;">${e.roomName}</p>
      </div>

      <!-- Room Overview -->
      <div style="background: linear-gradient(135deg, #ddd6fe 0%, #e0e7ff 100%); padding: 25px; border-radius: 12px; margin-bottom: 25px;">
        <h2 style="color: #7c3aed; margin-top: 0; display: flex; align-items: center;">
          ✨ ${e.roomName}
        </h2>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-top: 15px;">
          <div><strong>Primary Goal:</strong> ${e.primaryGoal}</div>
          <div><strong>Target Audience:</strong> ${e.targetAudience}</div>
          <div><strong>Time Commitment:</strong> ${e.timeCommitment}</div>
          <div><strong>Key Features:</strong> ${e.keyFeatures.join(", ")}</div>
        </div>
      </div>

      <!-- ROI Analysis -->
      <div style="background: #ecfdf5; padding: 25px; border-radius: 12px; margin-bottom: 25px;">
        <h2 style="color: #059669; margin-top: 0; display: flex; align-items: center;">
          💰 ROI & Time Savings
        </h2>
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; text-align: center; margin-top: 15px;">
          <div>
            <div style="font-size: 24px; font-weight: bold; color: #059669;">$${o.roiAnalysis.weekly.toLocaleString()}</div>
            <div style="color: #065f46; font-size: 14px;">Weekly Value</div>
          </div>
          <div>
            <div style="font-size: 24px; font-weight: bold; color: #059669;">$${o.roiAnalysis.monthly.toLocaleString()}</div>
            <div style="color: #065f46; font-size: 14px;">Monthly Value</div>
          </div>
          <div>
            <div style="font-size: 24px; font-weight: bold; color: #059669;">$${o.roiAnalysis.yearly.toLocaleString()}</div>
            <div style="color: #065f46; font-size: 14px;">Annual Value</div>
          </div>
        </div>
        <div style="text-align: center; margin-top: 15px; color: #065f46; font-size: 14px;">
          Based on ${o.roiAnalysis.memberCount} members saving ${o.roiAnalysis.hoursSaved} hours/week each
        </div>
      </div>

      <!-- Feedback Section -->
      <div style="background: #fff7ed; padding: 20px; border-radius: 8px; border-left: 4px solid #f97316; margin-bottom: 25px;">
        <h2 style="color: #f97316; margin-top: 0;">💬 Need Adjustments?</h2>
        <p style="margin-bottom: 15px;">Your Focus Room can be perfectly tailored to your community's needs!</p>
        <p style="margin-bottom: 15px;"><strong>Use the feedback button</strong> in your room to request:</p>
        <ul style="margin-bottom: 15px; padding-left: 20px;">
          <li>Fast dedicated room adjustments</li>
          <li>Custom tool integrations</li>
          <li>Specialized features for your use case</li>
          <li>Community-specific optimizations</li>
        </ul>
        <p style="margin-bottom: 0; font-weight: bold; color: #ea580c;">We respond within 24 hours with personalized solutions!</p>
      </div>

      <!-- Day in the Life -->
      <div style="background: #fff7ed; padding: 25px; border-radius: 12px; margin-bottom: 25px;">
        <h2 style="color: #ea580c; margin-top: 0; display: flex; align-items: center;">
          🕐 Day in the Life
        </h2>
        <div style="white-space: pre-line; color: #9a3412; line-height: 1.6;">
          ${o.dayInTheLife}
        </div>
      </div>

      <!-- Success Metrics -->
      <div style="background: #faf5ff; padding: 25px; border-radius: 12px; margin-bottom: 25px;">
        <h2 style="color: #9333ea; margin-top: 0; display: flex; align-items: center;">
          🎯 Success Metrics
        </h2>
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-top: 15px;">
          ${e.successMetrics.map(e=>`
            <div style="display: flex; align-items: center; color: #7c2d12;">
              <span style="color: #22c55e; margin-right: 8px;">✓</span>
              ${e}
            </div>
          `).join("")}
        </div>
      </div>

      <!-- Implementation Plan -->
      <div style="background: #f0f9ff; padding: 25px; border-radius: 12px; margin-bottom: 25px;">
        <h2 style="color: #0284c7; margin-top: 0;">🚀 Implementation Roadmap</h2>
        <div style="margin-top: 15px;">
          <div style="margin-bottom: 10px;"><strong>Phase 1:</strong> ${o.implementationPlan.phase1}</div>
          <div style="margin-bottom: 10px;"><strong>Phase 2:</strong> ${o.implementationPlan.phase2}</div>
          <div style="margin-bottom: 10px;"><strong>Phase 3:</strong> ${o.implementationPlan.phase3}</div>
        </div>
      </div>


      <!-- Call to Action -->
      <div style="background: linear-gradient(135deg, #1e40af 0%, #7c3aed 100%); color: white; padding: 25px; border-radius: 12px; text-align: center; margin-bottom: 25px;">
        <h2 style="margin-top: 0;">Ready to Launch Your Focus Room?</h2>
        <p style="margin-bottom: 20px; opacity: 0.9;">
          This specification is your blueprint for building a thriving community space. Let's make it happen!
        </p>
        <div style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;">
          <a href="https://kamunity.org" 
             style="background: white; color: #1e40af; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
            🌍 Get Started at Kamunity.org
          </a>
          <a href="https://kamunitydemo.org" 
             style="background: rgba(255,255,255,0.2); color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
            🎯 Explore More Features
          </a>
        </div>
      </div>

      <div style="text-align: center; border-top: 1px solid #e2e8f0; padding-top: 20px; margin-top: 30px;">
        <p style="color: #94a3b8; font-size: 14px; margin: 0;">
          Questions about your Focus Room? Reply to this email - we're here to help!<br>
          <strong>Building community, one room at a time.</strong>
        </p>
      </div>
    </div>
  `;await p({to:e.email,subject:`Your Focus Room Spec: ${e.roomName} 🎯`,html:t})}async function p({to:e,subject:o,html:t}){try{let i=await fetch("https://api.emailjs.com/api/v1.0/email/send",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({service_id:process.env.EMAILJS_SERVICE_ID,template_id:process.env.EMAILJS_TEMPLATE_ID,user_id:process.env.EMAILJS_USER_ID,template_params:{to_email:e,subject:o,html_content:t,from_name:"Kamunity Focus Room Generator",from_email:"rooms@kamunity.org"}})});if(!i.ok)throw Error(`Email service responded with ${i.status}`);console.log(`Focus Room spec sheet sent successfully to ${e}`)}catch(e){console.error("Failed to send Focus Room email:",e)}}let c=new r.AppRouteRouteModule({definition:{kind:s.x.APP_ROUTE,page:"/api/demo/focus-room/route",pathname:"/api/demo/focus-room",filename:"route",bundlePath:"app/api/demo/focus-room/route"},resolvedPagePath:"C:\\dev\\kamunity-final\\src\\app\\api\\demo\\focus-room\\route.ts",nextConfigOutput:"standalone",userland:i}),{requestAsyncStorage:g,staticGenerationAsyncStorage:u,serverHooks:y}=c,h="/api/demo/focus-room/route";function v(){return(0,a.patchFetch)({serverHooks:y,staticGenerationAsyncStorage:u})}}};var o=require("../../../../webpack-runtime.js");o.C(e);var t=e=>o(o.s=e),i=o.X(0,[8948,5972],()=>t(19102));module.exports=i})();