# Product Documentation

___

## Tech-Stack

![img](https://imgur.com/OgJemSV.png)

## Features
* Client Cert Authentication
* On demand BPPs creation and registration
* Create scholarship forms dynamicall
* Digital Signature - Create/Verify
* Approval History
* Integrate Existing Record
* Hyperledger - Tamperproof
* Cost Effective and Transparent
* Admin Panel - Hyperledger
* Private IPFS
* Multi-Compatibility
* Proxy Re-encryption


## Services
**Beckn Provider Platform As Service ( [BPPAS](./bppas-service) )**

* This service allows a provider to create their own BPP in a multi-tenant architecture.

    **Multi-tenant Architecture**

    ![Multi-tenant Architecture](https://miro.medium.com/max/1400/1*HIf4PQ7YIdYzN0Adxvgpzg.png)

* This will allow user to create their own BPP with DNS as **"\<Department>-\<Organisation>.portal.beckn.muhesh.studio"**

* Visit https://portal.beckn.muhesh.studio

  ![Login](https://imgur.com/9X47paU.png)

* Go to Create Page.

  ![Register](https://imgur.com/UG1hneo.png)

* Create Your BPP.

  ![Registered](https://imgur.com/l8d94Jh.png)

* Your BPP has been succesffully created in beckn registry.

  ![Registered](https://imgur.com/gisoi61.png)

* Check client-Certificate-Authentication in your mail.

  ![mail](https://imgur.com/LrPjjFe.png)

* Location of your client-Certificate-Authentication 

  ![mail](https://imgur.com/BIbIQ2Z.png)

* Visit your BPP with Url \<Department>.\<Organisation>.portal.beckn.muhesh.studio

* Preview of client-certificate-authentication selection prompt

  ![mail](https://imgur.com/r7L40nF.png)

* Click the Dashboard button in your Landing Page of your BPP

  ![mail](https://imgur.com/0DMtZIj.png)

* Dashboard's Home Page of your BPP

  ![mail](https://imgur.com/IXIHnpw.png)

* Multi-lingual support

  ![mail](https://imgur.com/wispOlp.png)

* Worflow Page, where you can create a scholarships along with the heirarchy of approvers based on role(supervisor, officer).

  ![adad](https://imgur.com/07TTNLk.png)

* Create Scholarship
  
  ![adaf](https://imgur.com/d3JV2RL.png)

* Add Workflow

  ![adadfg](https://imgur.com/XcmxAz5.png)

* Submit Workflow

  ![gsgs](https://imgur.com/hfhyreM.png)

* Added Workflow Successfully

  ![gsgsad](https://imgur.com/sBZznhW.png)

* Visit Form Builder Page, where you can build your customized application form for the scholarships you provide.

* Create a Form

  ![asvs](https://imgur.com/h2oI7op.png)

* Add Custom Form Fields

  ![asvs](https://imgur.com/MBHlMo6.png)
  ![fafaf](https://imgur.com/BES7ej1.png)
  ![afafg](https://imgur.com/gUzPt5x.png)

* Scholarship Form created successfully

  ![vbsgs](https://imgur.com/G83C8jF.png)

* View Applicant Details and Approve/Reject it.

  ![approve](https://imgur.com/dwmQmgB.png)

* Approve the Application.

  ![approved](https://imgur.com/flGeJYe.png)


**Beckn Application Platform (E-Scholar)**

* E-scholar is a BAP where students/candidates can get scholarships from all the BPPs with network domain dsep:scholarships.

* Visit E-scholar website at url https://beckn.muhesh.studio

  ![home](https://imgur.com/rBjmuny.png)

* Create Account 

  ![reg](https://imgur.com/60X1tQA.png)

* Login

  ![reglog](https://imgur.com/gvsL4Qa.png)  

* Home Page of the User with multi-lingual support

  ![home](https://imgur.com/w3DcfrR.png)

* Search Scholarship Page.

  ![search](https://imgur.com/iS8DI6U.png)

* Scholarship provided by BPP cse-nitt

  ![search](https://imgur.com/t1SWNKB.png)

* Scholarship provided by BPP ece-nitt is appended when it callsback

  ![search](https://imgur.com/0hT6LuG.png)

* Fillup the application form

  ![apply1](https://imgur.com/ymguIM1.png)
  ![apply2](https://imgur.com/jsViPyU.png)
  ![apply3](https://imgur.com/eyvqNfn.png)

* Press Submit to Convert your Form into a PDF and store it in IPFS and send the IPFS Hash to BPP 


* View Status of the Applied Scholarship from BPP

  ![status1](https://imgur.com/vzqfhT1.png)
  ![status2](https://imgur.com/bfmc3Sf.png)
* Status When Officer Approves
  ![status3](https://imgur.com/mIq3q4O.png)
* Status when Supervisor Approves
  ![status4](https://imgur.com/9g78bxp.png)
* Download Signed Document
  ![status5](https://imgur.com/J5g1Aum.png)
* Preview of Signed Document
  ![status6](https://imgur.com/D28EAQX.png)

* Verify the document.

  ![verify](https://imgur.com/zIquwZU.png)
  
**Beckn Application Platform - Android**

* Android App made using Trusted Web Activity

|<img src=https://imgur.com/mqTIOOG.png > | <img src=https://imgur.com/XtQLVzB.png >
|:---:|:---:|

**IPFS**
* Stores the application form of the scholarship applicant in a PDF format.
   ![ledger](https://imgur.com/f60eZ6y.png)

**HyperLedger**
* Stores IPFS in blockchain.
 ![ledger](https://imgur.com/f60eZ6y.png)


## Workflow:

![workflow](https://imgur.com/CMd4tQN.jpeg)
* **/search**
     * Forwards the search for scholarships from [BAP-Client](./bap-client) to [BG](https://gateway.becknprotocol.io/bg) 
     * Receives ACK from [BG](https://gateway.becknprotocol.io/bg)
 * **/on_search**
    * [BPP](./bpp-service/) which recieved the **/search** broadcast from [BG](https://gateway.becknprotocol.io/bg) sends relevant response as per [dsep:scholarships]() specifications  via callback to [BAP](./bap-service) which then emits the the incoming req body to socket.io.
    * [BAP-client](./bap-client/) which is in socket.io connection with [BAP-service](./bap-service) recieves and renders it for user.

* **/select**
    * Forwards the selected scholarships from [BAP-Client](./bap-client) to [BG](https://gateway.becknprotocol.io/bg) 
    * Receives ACK from [BG](https://gateway.becknprotocol.io/bg)
* **/on_select**
    * [BPP](./bpp-service/) which recieved the **/select**  request from [BG](https://gateway.becknprotocol.io/bg) sends relevant scholarship details as per [dsep:scholarships]() specifications via callback to [BAP](./bap-service) which then emits the the incoming req body to socket.io.
    * [BAP-client](./bap-client/) which is in socket.io connection with [BAP-service](./bap-service) 
        recieves and renders it for user.

* **/init**
    * Forwards the scholarship Application initiation from [BAP-Client](./bap-client) to [BG](https://gateway.becknprotocol.io/bg) 
    * Receives ACK from [BG](https://gateway.becknprotocol.io/bg)

* **/on_init**
    * [BPP](./bpp-service/) which recieved the **/init** request from [BG](https://gateway.becknprotocol.io/bg) sends acknowledges the  initiation and responds via callback to [BAP](./bap-service) which then emits the the incoming req body to socket.io.
    * [BAP-client](./bap-client/) which is in socket.io connection with [BAP-service](./bap-service) recieves and renders it for user.

* **/confirm**
    * Stores the Details PDF document generated via [BAP-Client](./bap-client) input in [IPFS](./ipfs-config/) and forwards the IPFS-HASH-KEY to [BG](https://gateway.becknprotocol.io/bg) 
    * Receives ACK from [BG](https://gateway.becknprotocol.io/bg)
        
* **/on_confirm**
    * [BPP](./bpp-service/) which recieved the request **/confirm** from [BG](./beckn-network/), retrives the Document with IPFS HASH and stores it in [Blockchain](./blockchain/) and  sends applicationID as per [dsep:scholarships]() specifications via callback to [BAP](./bap-service) which then emits the the incoming req body to socket.io.
    * [BAP-client](./bap-client/) which is in socket.io connection with [BAP-service](./bap-service) recieves and renders it for user.
        
* **/status**
    * Forwards the applicationID sent via [BAP-Client](./bap-client) input to [BG](https://gateway.becknprotocol.io/bg) 
    * Receives ACK from [BG](https://gateway.becknprotocol.io/bg)
* **/on_status**
    * [BPP](./bpp-service/) which recieved the **/status**  request from [BG](./beckn-network/), fetches the application details based on applicationID and  sends application status as per [dsep:scholarships]() specifications via callback to [BAP](./bap-service) which then emits the the incoming req body to socket.io.
    * [BAP-client](./bap-client/) which is in socket.io connection with [BAP-service](./bap-service) recieves and renders it for user.