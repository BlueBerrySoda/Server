테스트용 로그인
============

localhost:4000/api/auth
-----------------------
  *POST    /register/local                         로컬 계정 등록
  *POST    /login/local                            로컬 계정 로그인
  *GET     /exists/:key(email|username)/:value     유저 이메일|이름 검색
  *POST    /logout                                 로그아웃(미구현)

localhost:4000/api/account          
--------------------------
  *GET     /                                       전체 계정 리스트
  *GET     /:id                                    계정 id 검색
  *POST    /                                       계정 생성
  *DELETE  /:id                                    계정 삭제
  *PUT     /:id                                    계정 정보 전체 수정
  *PATCH   /:id                                    계정 정보 일부 수정
