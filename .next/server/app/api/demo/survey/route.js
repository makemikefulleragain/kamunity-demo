"use strict";(()=>{var e={};e.id=2436,e.ids=[2436],e.modules={20399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},47783:(e,t,o)=>{o.r(t),o.d(t,{originalPathname:()=>h,patchFetch:()=>v,requestAsyncStorage:()=>g,routeModule:()=>p,serverHooks:()=>y,staticGenerationAsyncStorage:()=>c});var i={};o.r(i),o.d(i,{POST:()=>l});var s=o(49303),n=o(88716),r=o(60670),a=o(87070);async function l(e){try{let{surveyData:t,analyticsData:o,timestamp:i}=await e.json();return await d(t,o,i),t.email&&await u(t,o,i),a.NextResponse.json({success:!0,message:"Survey submitted successfully"})}catch(e){return console.error("Survey submission error:",e),a.NextResponse.json({success:!1,message:"Failed to submit survey"},{status:500})}}async function d(e,t,o){let i=`
    <h2>New Kamunity Demo Feedback</h2>
    <p><strong>Submitted:</strong> ${new Date(o).toLocaleString()}</p>
    
    <h3>Survey Responses</h3>
    <ul>
      <li><strong>Experience:</strong> ${e.experience}</li>
      <li><strong>Most Interesting:</strong> ${e.mostInteresting}</li>
      <li><strong>Would Use Again:</strong> ${e.wouldUseAgain}</li>
      <li><strong>Suggestions:</strong> ${e.suggestions||"None provided"}</li>
      <li><strong>Feature Ideas:</strong> ${e.additionalFeatures||"None provided"}</li>
      <li><strong>Room Ideas:</strong> ${e.roomIdeas||"None provided"}</li>
      <li><strong>Email:</strong> ${e.email||"Not provided"}</li>
    </ul>

    <h3>Analytics Summary</h3>
    <ul>
      <li><strong>Session ID:</strong> ${t.sessionId}</li>
      <li><strong>User ID:</strong> ${t.userId||"Anonymous"}</li>
      <li><strong>Engagement Level:</strong> ${t.engagementLevel}</li>
      <li><strong>Behavior Patterns:</strong> ${JSON.stringify(t.interests?.behaviorPatterns||{})}</li>
      <li><strong>Recommended Actions:</strong> ${t.recommendedActions?.join(", ")||"None"}</li>
    </ul>
  `;await m({to:"mike@kamunityconsulting.com",subject:"New Kamunity Demo Feedback",html:i})}async function u(e,t,o){let i=`
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #0ea5e9; margin-bottom: 10px;">Thank You for Your Feedback! 🎉</h1>
        <p style="color: #666; font-size: 18px;">Here's a summary of your Kamunity demo experience</p>
      </div>

      <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h2 style="color: #334155; margin-top: 0;">Your Feedback Summary</h2>
        <ul style="color: #64748b; line-height: 1.6;">
          <li>Experience rating: <strong>${e.experience}</strong></li>
          <li>Most interesting: <strong>${e.mostInteresting}</strong></li>
          <li>Would use again: <strong>${e.wouldUseAgain}</strong></li>
          ${e.suggestions?`<li>Your suggestions: "${e.suggestions}"</li>`:""}
          ${e.additionalFeatures?`<li>Feature ideas: "${e.additionalFeatures}"</li>`:""}
          ${e.roomIdeas?`<li>Room ideas: "${e.roomIdeas}"</li>`:""}
        </ul>
      </div>

      <div style="text-align: center; margin: 30px 0;">
        <h3 style="color: #334155;">Thank You for Exploring Kamunity</h3>
        <p style="color: #64748b; margin-bottom: 20px;">
          Your feedback helps us understand how people experience community-building platforms. 
          This demo showcases the potential for progressive community organization.
        </p>
        
        <div style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;">
          <a href="https://kamunity.org" 
             style="background: #0ea5e9; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            🌍 Learn More
          </a>
          <a href="https://kamunitydemo.org" 
             style="background: #a855f7; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            🎯 Try Demo Again
          </a>
        </div>
      </div>

      <div style="text-align: center; border-top: 1px solid #e2e8f0; padding-top: 20px; margin-top: 30px;">
        <p style="color: #94a3b8; font-size: 14px; margin: 0;">
          Questions or ideas? Reply to this email anytime.<br>
          <strong>Building community, one conversation at a time.</strong>
        </p>
      </div>
    </div>
  `;await m({to:e.email,subject:"Thank you for your Kamunity feedback! \uD83C\uDF89",html:i})}async function m({to:e,subject:t,html:o}){try{let i=await fetch("https://api.emailjs.com/api/v1.0/email/send",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({service_id:process.env.EMAILJS_SERVICE_ID,template_id:process.env.EMAILJS_TEMPLATE_ID,user_id:process.env.EMAILJS_USER_ID,template_params:{to_email:e,subject:t,html_content:o,from_name:"Kamunity Demo",from_email:"demo@kamunity.org"}})});if(!i.ok)throw Error(`Email service responded with ${i.status}`);console.log(`Email sent successfully to ${e}`)}catch(e){console.error("Failed to send email:",e)}}let p=new s.AppRouteRouteModule({definition:{kind:n.x.APP_ROUTE,page:"/api/demo/survey/route",pathname:"/api/demo/survey",filename:"route",bundlePath:"app/api/demo/survey/route"},resolvedPagePath:"C:\\dev\\kamunity-final\\src\\app\\api\\demo\\survey\\route.ts",nextConfigOutput:"",userland:i}),{requestAsyncStorage:g,staticGenerationAsyncStorage:c,serverHooks:y}=p,h="/api/demo/survey/route";function v(){return(0,r.patchFetch)({serverHooks:y,staticGenerationAsyncStorage:c})}}};var t=require("../../../../webpack-runtime.js");t.C(e);var o=e=>t(t.s=e),i=t.X(0,[8948,5972],()=>o(47783));module.exports=i})();