import {SpeedDial} from '@rneui/themed';
import {ReactNode, useState} from 'react';
import {SpeedDialAction, SpeedDialSettingContext} from './SpeedDialContext';

/**
 * スピードダイアル制御プロバイダー
 */
export const SpeedDialProvider = ({children}: {children: ReactNode}) => {
  // スピードダイアル開閉制御
  const [open, setOpen] = useState<boolean>(false);
  // ダイアル設定制御
  const [actions, setActions] = useState<SpeedDialAction[]>(
    // 理由は不明だが、初期生成された数以上後にセットするとエラー発生につきダミーを生成
    new Array(3).map(_ => ({
      icon: 'menu',
      title: 'dummy',
      onPress: () => {},
    })),
  );

  return (
    <SpeedDialSettingContext.Provider value={{setActions}}>
      {children}
      {actions.length !== 0 && (
        <SpeedDial
          isOpen={open}
          icon={{name: 'menu', color: 'white'}}
          openIcon={{name: 'close', color: 'white'}}
          onOpen={() => setOpen(!open)}
          onClose={() => setOpen(!open)}>
          {actions.map((a, i) => (
            <SpeedDial.Action
              key={i}
              icon={{name: a.icon, color: 'white'}}
              title={a.title}
              onPress={() => {
                setOpen(false);
                a.onPress();
              }}
            />
          ))}
        </SpeedDial>
      )}
    </SpeedDialSettingContext.Provider>
  );
};
