AUTH CONTROLLER – COMPLETE CODE FLOWCHART
This shows the execution flow of each function inside auth.controller.js, step by step, in the same order as the code executes.

1.  REGISTER – register()

              register(req, res)
                      |
                      ▼
             Receive req.body
          (username, email, password)
                      |
                      ▼
              Validate Input
                      |
                      ▼
          Check Existing User in DB
                      |
               ┌──────┴──────┐
               |             |
              YES            NO
               |             |
        Return 409 Error     ▼
                     Hash Password
                            |
                            ▼
                     Create User in DB
                            |
                            ▼
                      Generate OTP
                            |
                            ▼
                       Hash OTP
                            |
                            ▼
                    Save OTP in DB
                            |
                            ▼
                     Generate OTP HTML
                            |
                            ▼
                     Send OTP Email
                            |
                            ▼
                    Return 201 Success

2.  VERIFY EMAIL – verifyEmail()

             verifyEmail(req, res)
                      |
                      ▼
             Receive Email & OTP
                      |
                      ▼
              Find User in DB
                      |
               ┌──────┴──────┐
               |             |
             Not Found       Found
               |             |
          Return 404         ▼
                       Find OTP in DB
                              |
                              ▼
                       Hash Submitted OTP
                              |
                              ▼
                       Compare OTP Hash
                              |
                       ┌──────┴──────┐
                       |             |
                     Invalid        Valid
                       |             |
                  Return Error      ▼
                              Check OTP Expiry
                                     |
                              ┌──────┴──────┐
                              |             |
                            Expired       Valid
                              |             |
                         Return Error      ▼
                                    Update User
                                  verified = true
                                          |
                                          ▼
                                    Delete OTP
                                          |
                                          ▼
                                   Return Success

3.  LOGIN – login()

                login(req, res)
                      |
                      ▼
             Receive Email & Password
                      |
                      ▼
                Find User in DB
                      |
               ┌──────┴──────┐
               |             |
             Not Found       Found
               |             |
          Return 401         ▼
                      Check User Verified
                              |
                       ┌──────┴──────┐
                       |             |
                       NO            YES
                       |             |
                 Return Error       ▼
                              Hash Password
                                     |
                                     ▼
                              Compare Password
                                     |
                              ┌──────┴──────┐
                              |             |
                            Invalid        Valid
                              |             |
                         Return 401        ▼
                                    Generate Refresh Token
                                              |
                                              ▼
                                    Hash Refresh Token
                                              |
                                              ▼
                                      Create Session
                                              |
                                              ▼
                                    Generate Access Token
                                              |
                                              ▼
                                      Set Refresh Cookie
                                       (HttpOnly Cookie)
                                              |
                                              ▼
                                       Return 200 Success
                                      (Access Token + User)

4.  GET ME – getMe()

                 getMe(req, res)
                       |
                       ▼
              Read Authorization Header
                       |
                       ▼
               Extract Bearer Token
                       |
                       ▼
                 Token Available?
                       |
                ┌──────┴──────┐
                |             |
                NO            YES
                |             |
           Return 401         ▼
                       Verify JWT Token
                              |
                       ┌──────┴──────┐
                       |             |
                     Invalid        Valid
                       |             |
                  Return 401        ▼
                              Extract User ID
                                      |
                                      ▼
                              Find User in DB
                                      |
                               ┌──────┴──────┐
                               |             |
                             Not Found      Found
                               |             |
                          Return 404        ▼
                                     Return User Details

5.  REFRESH TOKEN – refreshToken()

             refreshToken(req, res)
                       |
                       ▼
              Read Refresh Cookie
                       |
                ┌──────┴──────┐
                |             |
              Missing        Found
                |             |
           Return 401         ▼
                       Verify Refresh JWT
                              |
                       ┌──────┴──────┐
                       |             |
                     Invalid        Valid
                       |             |
                  Return 401        ▼
                              Hash Refresh Token
                                      |
                                      ▼
                              Find Active Session
                                      |
                               ┌──────┴──────┐
                               |             |
                             Not Found      Found
                               |             |
                          Return 401        ▼
                                     Generate New Access Token
                                              |
                                              ▼
                                     Generate New Refresh Token
                                              |
                                              ▼
                                     Hash New Refresh Token
                                              |
                                              ▼
                                     Update Session Hash
                                              |
                                              ▼
                                     Set New Refresh Cookie
                                              |
                                              ▼
                                     Return New Access Token

6.  LOGOUT – logout()

                  logout(req, res)
                        |
                        ▼
               Read Refresh Cookie
                        |
                 ┌──────┴──────┐
                 |             |
               Missing        Found
                 |             |
            Return 401         ▼
                       Hash Refresh Token
                               |
                               ▼
                       Find Active Session
                               |
                        ┌──────┴──────┐
                        |             |
                      Not Found      Found
                        |             |
                   Return 401        ▼
                              Set revoked = true
                                      |
                                      ▼
                                Save Session
                                      |
                                      ▼
                                Clear Cookie
                                      |
                                      ▼
                                Return Success

7.  LOGOUT ALL – logoutAll()

                logoutAll(req, res)
                        |
                        ▼
               Read Refresh Cookie
                        |
                        ▼
               Verify Refresh JWT
                        |
                        ▼
               Extract User ID
                        |
                        ▼
             Find All Active Sessions
                        |
                        ▼
              Update Many Sessions
                 revoked = true
                        |
                        ▼
                 Clear Cookie
                        |
                        ▼
                 Return Success

COMPLETE AUTHENTICATION SYSTEM FLOWCHART

                    AUTHENTICATION SYSTEM
                             |
              ┌──────────────┴──────────────┐
              |                             |
           REGISTER                       LOGIN
              |                             |
       Receive User Data             Receive Email & Password
              |                             |
       Validate Input                Find User in Database
              |                             |
       Check Duplicate               Verify Password
              |                             |
       Hash Password                 Check Email Verified
              |                             |
       Create User                   Create Session
              |                             |
       Generate 6-Digit OTP          Generate JWT Tokens
              |                       /             \
       Hash OTP                  Access Token     Refresh Token
              |                       |                |
       Save OTP in DB           Send to Client    Set Cookie
              |                       |           (HttpOnly)
       Send OTP Email                 |                |
              |                  Store in Memory       |
         VERIFY OTP                    |                |
              |                  Protected APIs        |
       Receive Email & OTP              |                |
              |                    GET ME API           |
       Hash Submitted OTP               |                |
              |                  Verify Access Token    |
       Match OTP with DB                |                |
              |                         |                |
       Check OTP Expiry            Find User in DB       |
              |                         |                |
       Verify OTP                     Return User Details|
              |                                          |
       Update User Status                               |
       (verified = true)                                |
              |                                          |
       Delete OTP from DB                                |
              |                                          |
       VERIFIED USER                                     |
                                                         |
                                              REFRESH TOKEN API
                                                         |
                                              Read Refresh Cookie
                                                         |
                                              Verify Refresh JWT
                                                         |
                                              Hash Refresh Token
                                                         |
                                              Find Active Session
                                                         |
                                              Generate New JWTs
                                                   /          \
                                           New Access       New Refresh
                                              Token            Token
                                                |                |
                                          Send to Client    Update Cookie
                                                                 |
                                                         Update Session
                                                                 |
                                                         LOGOUT API
                                                                 |
                                                         Read Refresh Cookie
                                                                 |
                                                         Hash Refresh Token
                                                                 |
                                                         Find Session
                                                                 |
                                                         Mark Revoked
                                                         (revoked = true)
                                                                 |
                                                         Clear Cookie
                                                                 |
                                                         LOGOUT SUCCESS
