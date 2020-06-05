const FailedMessageObj = {
  INVALID_PARAM: {
    MESSAGE: 'ERR_INVALID_PARAM', 
    DESCRIPTION: '필수 파라미터가 전달되지 않았습니다.'
  },
  INVALID_EMAIL_PWD: {
    MESSAGE: 'ERR_INVALID_EMAIL_PWD',
    DESCRIPTION: '이메일이나 비밀번호가 틀렸습니다'
  },
  EXIST_EMAIL: {
    MESSAGE: 'ERR_EXIST_EMAIL',
    DESCRIPTION: '중복된 이메일입니다. 이미 가입된 계정으로 로그인 해주세요.'
  },
  INVAILD_PWD: {
    MESSAGE: 'ERR_INVALID_PWD', 
    DESCRIPTION: '기존 비밀번호가 틀렸습니다'
  },
  NOT_EXIST: {
    MESSAGE: 'ERR_NOT_EXIST', 
    DESCRIPTION: '식별자 데이터가 DB에 없습니다'
  },
  EXIST_NICKNAME: {
    MESSAGE: 'ERR_EXIST_NICKNAME',
    DESCRIPTION: '다른 사용자의 닉네임입니다'
  }
}

module.exports = {
  FailedMessageObj
}