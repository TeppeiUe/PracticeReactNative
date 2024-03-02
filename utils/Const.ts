/**
 * 共通定数
 */
class Const {
  /** DB名 */
  DB_NAME = 'climbingPlan.sqlite3';

  /** 必須項目エラーメッセージ */
  VALIDATION_MESSAGE_REQUIRED = 'required fields';
  /** 不正値エラーメッセージ */
  VALIDATION_MESSAGE_INVALID = 'invalid value';

  /** 登録確認メッセージ */
  CONFIRM_MESSAGE_REGISTER = 'Would you like to register?';
  /** 更新確認メッセージ */
  CONFIRM_MESSAGE_UPDATE = 'Would you like to save?';
  /** 削除確認メッセージ */
  CONFIRM_MESSAGE_DELETE = 'Would you like to delete?';

  /** 登録失敗メッセージ */
  FAILED_MESSAGE_REGISTER = 'Registration failed.';
  /** 取得失敗メッセージ */
  FAILED_MESSAGE_ACQUISITION = 'Failed to retrieve data.';
  /** 更新失敗メッセージ */
  FAILED_MESSAGE_UPDATE = 'Update failed.';
  /** 削除失敗メッセージ */
  FAILED_MESSAGE_DELETE = 'Deletion failed.';
}

export default new Const();
