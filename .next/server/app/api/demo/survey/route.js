"use strict";(()=>{var e={};e.id=2436,e.ids=[2436],e.modules={20399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},47783:(e,o,t)=>{t.r(o),t.d(o,{originalPathname:()=>v,patchFetch:()=>x,requestAsyncStorage:()=>p,routeModule:()=>g,serverHooks:()=>h,staticGenerationAsyncStorage:()=>y});var i={};t.r(i),t.d(i,{POST:()=>l});var s=t(49303),n=t(88716),r=t(60670),a=t(87070);async function l(e){try{console.log("\uD83D\uDD25 Survey API called");let{surveyData:o,analyticsData:t,timestamp:i}=await e.json();return console.log("\uD83D\uDCCB Survey data received:",{hasEmail:!!o.email,experience:o.experience,emailAddress:o.email?o.email.substring(0,3)+"***":"none"}),console.log("\uD83D\uDCE7 Sending admin notification..."),await u(o,t,i),console.log("✅ Admin notification sent"),o.email?(console.log("\uD83D\uDCE7 Sending user thank you email..."),await d(o,t,i),console.log("✅ User thank you email sent")):console.log("⚠️ No user email provided, skipping user email"),a.NextResponse.json({success:!0,message:"Survey submitted successfully"})}catch(e){return console.error("\uD83D\uDCA5 Survey submission error:",e),a.NextResponse.json({success:!1,message:"Failed to submit survey"},{status:500})}}async function u(e,o,t){let i=`
    <h2>New Kamunity Demo Feedback</h2>
    <p><strong>Submitted:</strong> ${new Date(t).toLocaleString()}</p>
    
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
      <li><strong>Session ID:</strong> ${o.sessionId}</li>
      <li><strong>User ID:</strong> ${o.userId||"Anonymous"}</li>
      <li><strong>Engagement Level:</strong> ${o.engagementLevel}</li>
      <li><strong>Behavior Patterns:</strong> ${JSON.stringify(o.interests?.behaviorPatterns||{})}</li>
      <li><strong>Recommended Actions:</strong> ${o.recommendedActions?.join(", ")||"None"}</li>
    </ul>
  `;await m({to:"mike@kamunityconsulting.com",subject:"New Kamunity Demo Feedback",html:i})}async function d(e,o,t){let i=`
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
  `;await m({to:e.email,subject:"Thank you for your Kamunity feedback! \uD83C\uDF89",html:i})}async function m({to:e,subject:o,html:t}){let i={success:!1,method:"none"};try{if(process.env.EMAILJS_SERVICE_ID&&process.env.EMAILJS_TEMPLATE_ID&&process.env.EMAILJS_USER_ID)try{console.log("\uD83D\uDCE7 Attempting EmailJS send:",{to:e,subject:o.substring(0,50)});let s=await fetch("https://api.emailjs.com/api/v1.0/email/send",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({service_id:process.env.EMAILJS_SERVICE_ID,template_id:process.env.EMAILJS_TEMPLATE_ID,user_id:process.env.EMAILJS_USER_ID,template_params:{to_email:e,to_name:e.split("@")[0],subject:o,message:t,html_content:t,from_name:"Kamunity Demo",from_email:"demo@kamunity.org",reply_to:"mike@kamunity.AI"}})});if(console.log("\uD83D\uDCE7 EmailJS response status:",s.status),s.ok){let e=await s.text();console.log("\uD83D\uDCE7 EmailJS response:",e)}else{let e=await s.text();console.error("\uD83D\uDCE7 EmailJS error:",e)}if(s.ok)return console.log(`✅ Email sent via EmailJS to ${e}`),i.success=!0,i.method="emailjs",i}catch(e){console.warn("EmailJS failed, trying fallback:",e)}console.log(`📧 EMAIL SIMULATION - To: ${e}`),console.log(`📧 EMAIL SIMULATION - Subject: ${o}`),console.log(`📧 EMAIL SIMULATION - Content: ${t.substring(0,200)}...`),i.success=!0,i.method="console_simulation",await c(e,o,i.method,i.success)}catch(t){console.error("All email methods failed:",t),await c(e,o,"failed",!1)}return i}async function c(e,o,t,i){try{console.log(`📊 Email Delivery: ${i?"SUCCESS":"FAILED"} via ${t} to ${e.includes("@")?e.split("@")[1]:"unknown"}`)}catch(e){console.warn("Failed to track email delivery:",e)}}let g=new s.AppRouteRouteModule({definition:{kind:n.x.APP_ROUTE,page:"/api/demo/survey/route",pathname:"/api/demo/survey",filename:"route",bundlePath:"app/api/demo/survey/route"},resolvedPagePath:"C:\\dev\\kamunity-final\\src\\app\\api\\demo\\survey\\route.ts",nextConfigOutput:"",userland:i}),{requestAsyncStorage:p,staticGenerationAsyncStorage:y,serverHooks:h}=g,v="/api/demo/survey/route";function x(){return(0,r.patchFetch)({serverHooks:h,staticGenerationAsyncStorage:y})}}};var o=require("../../../../webpack-runtime.js");o.C(e);var t=e=>o(o.s=e),i=o.X(0,[8948,5972],()=>t(47783));module.exports=i})();