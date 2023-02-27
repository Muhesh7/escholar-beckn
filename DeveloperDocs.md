# Developer Docs

___
### Requirements
* **Software**
    * [Node](https://nodejs.org/en/download/)
    * [Docker](https://docs.docker.com/get-docker/)
    * [AndroidStudio](https://developer.android.com/studio/install)
* **Hardware**
    * 10GB Space

### References
* [IPFS](https://ipfs.tech)
* [Hyperledger](https://www.hyperledger.org)
* [Multi-tenant-Architecture](https://www.cloudflare.com/en-in/learning/cloud/what-is-multitenancy/)
* [Trusted-Web-Activity](https://developer.chrome.com/docs/android/trusted-web-activity/)


### Setup
* clone the repository
  ```bash
  git clone <REPO_URL>
  ```

### Run
* [bpp-service](./bpp-service/)
    ```bash
    docker-compose up && cd bpp-service && npm start
    cd ..
    ```
* [bap-service](./bap-service/)
    ```bash
    docker-compose up && npm start
    ```
* [bpp-client](./bpp-client/)
    ```bash
    yarn start
    ```
* [bap-client](./bap-client/)
    ```bash
    yarn start
    ```
* [blockchain](./blockchain/)  
    Start the admin panel to manage the hyperledger blockchain.
    ```bash
    cd blockchain
    npm i
    npm start
    ```
    Click on all the steps until `queryCommitted` to start the blockchain.
    ![blockchain admin panel](https://i.imgur.com/xBSkD34.png)  
    
    NOTE: Do not run `networkDown` until required. It is used to reset the blockchain network.

* [ipfs-config](./ipfs-config)  
  Refer to the documentation in the [README](./ipfs-config/README.md) to setup the IPFS cluster.
* [bap-android](./bap-android/)
    ```bash
    adb shell am start -n io.beckn.e_scholar
    ```