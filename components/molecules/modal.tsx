import React from 'react'
import { useModal } from 'context/modal-context'
import Icon from '@mdi/react'
import { mdiClose } from '@mdi/js'

import styles from './modal.module.scss'
import { Button } from '../atoms/button'

interface ModalProps {
  children: React.ReactNode
}

export function Modal({ children }: ModalProps) {
  const { closeModal } = useModal()

  return (
    <div className={styles.modalDefault}>
      <div className="fixed inset-0 transition-opacity">
        <div className="absolute inset-0 bg-grey-cool-100 opacity-75" />
        <div className={styles.dialog}>
          <div className={styles.dialogBg}>
            <div className={styles.dialogContent}>
              <div className={styles.closeBtn}>
                <Button
                  color="transparent"
                  target="_self"
                  href={null}
                  onButtonClick={() => closeModal()}
                >
                  <Icon path={mdiClose} size={2} />
                </Button>
              </div>
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
