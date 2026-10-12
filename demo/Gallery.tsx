import { useEffect, useRef, useState, type ReactNode } from 'react';
import {
  Button,
  Checkbox,
  Dropdown,
  Input,
  Modal,
  Radio,
  Select,
  Switch,
  Tabs,
  ToastProvider,
  Tooltip,
  libraryVersion,
  toast,
  useTheme,
} from '../src';

const catalog = [
  'Button',
  'Input',
  'Select',
  'Checkbox',
  'Radio',
  'Switch',
  'Modal',
  'Dropdown',
  'Tooltip',
  'Tabs',
  'Toast',
];
const frameworks = [
  { value: 'react', label: 'React' },
  { value: 'vue', label: 'Vue' },
  { value: 'angular', label: 'Angular', disabled: true },
  { value: 'svelte', label: 'Svelte' },
];

function Section({
  id,
  title = id,
  note,
  wide,
  children,
}: {
  id: string;
  title?: string;
  note: string;
  wide?: boolean;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className={`gallery-card${wide ? ' gallery-wide' : ''}`}
      aria-labelledby={`${id}-heading`}
    >
      <header className="section-heading">
        <h2 id={`${id}-heading`}>{title}</h2>
        <span>{note}</span>
      </header>
      {children}
    </section>
  );
}

function Notifications() {
  useEffect(() => {
    const ids = [
      toast.success('Изменения сохранены', { duration: 0 }),
      toast.error('Не удалось сохранить проект', { duration: 0 }),
      toast.info('Доступно обновление библиотеки', { duration: 0 }),
    ];
    return () => ids.forEach((id) => toast.dismiss(id));
  }, []);
  return (
    <ToastProvider label="Примеры уведомлений" className="gallery-toasts">
      <div className="gallery-row">
        <Button onClick={() => toast.success('Изменения сохранены')}>
          Success
        </Button>
        <Button
          variant="danger"
          onClick={() => toast.error('Не удалось сохранить проект')}
        >
          Error
        </Button>
        <Button
          variant="secondary"
          onClick={() => toast.info('Доступно обновление библиотеки')}
        >
          Info
        </Button>
        <Button
          variant="ghost"
          onClick={() =>
            toast.info('Закройте это уведомление вручную', { duration: 0 })
          }
        >
          Без таймера
        </Button>
        <Button variant="ghost" onClick={() => toast.dismiss()}>
          Закрыть все
        </Button>
      </div>
      <p className="gallery-note">
        Новые уведомления исчезают через 5 секунд. Наведение и фокус
        приостанавливают таймер.
      </p>
    </ToastProvider>
  );
}

export function Gallery() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [active, setActive] = useState(location.hash.slice(1) || 'components');
  const [text, setText] = useState('');
  const [selection, setSelection] = useState('react');
  const [tab, setTab] = useState('overview');
  const [message, setMessage] = useState('');
  const [modal, setModal] = useState<
    'default' | 'long' | 'locked' | 'nested' | null
  >(null);
  const [nested, setNested] = useState(false);
  const firstInput = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const update = () => setActive(location.hash.slice(1) || 'components');
    window.addEventListener('hashchange', update);
    return () => window.removeEventListener('hashchange', update);
  }, []);
  const closeModal = () => {
    setNested(false);
    setModal(null);
  };
  const report = (value: string) => setMessage(`Выбрано: ${value}`);
  return (
    <>
      <a className="skip-link" href="#components">
        Перейти к компонентам
      </a>
      <header className="gallery-header">
        <a href="#components" className="gallery-brand">
          <span className="gallery-mark" aria-hidden="true">
            C
          </span>
          <strong>Cyclone UI</strong>
          <span className="gallery-version">v{libraryVersion}</span>
        </a>
        <div className="gallery-row">
          <label className="gallery-theme">
            Тема{' '}
            <select
              value={theme}
              onChange={(event) => setTheme(event.target.value as typeof theme)}
            >
              <option value="system">Авто</option>
              <option value="light">Светлая</option>
              <option value="dark">Тёмная</option>
            </select>
          </label>
          <a
            className="gallery-link"
            href="https://github.com/Doctor-Cyclone/design-system"
            target="_blank"
            rel="noreferrer"
          >
            GitHub ↗
          </a>
        </div>
      </header>
      <div className="gallery-layout">
        <aside className="gallery-sidebar">
          <nav aria-label="Каталог компонентов">
            <p className="nav-caption">Каталог</p>
            <a
              href="#components"
              aria-current={active === 'components' ? 'location' : undefined}
            >
              Все компоненты
            </a>
            {catalog.map((name) => (
              <a
                key={name}
                href={`#${name}`}
                aria-current={active === name ? 'location' : undefined}
              >
                {name}
              </a>
            ))}
            <p className="nav-caption">Основа</p>
            <a
              href="#tokens"
              aria-current={active === 'tokens' ? 'location' : undefined}
            >
              Design tokens
            </a>
          </nav>
        </aside>
        <main id="components" className="gallery-main">
          <div className="gallery-intro">
            <div>
              <h1>Компоненты</h1>
              <p>Все элементы и их состояния — на одной странице.</p>
            </div>
            <span>
              {catalog.length} компонентов · {resolvedTheme}
            </span>
          </div>
          <div className="gallery-grid">
            <Section id="Button" note="Варианты · размеры · состояния" wide>
              <div className="gallery-row">
                {(['primary', 'secondary', 'danger', 'ghost'] as const).map(
                  (variant) => (
                    <Button
                      key={variant}
                      variant={variant}
                      onClick={() => report(variant)}
                    >
                      {variant.charAt(0).toUpperCase() + variant.slice(1)}
                    </Button>
                  ),
                )}
                <Button
                  iconOnly
                  aria-label="Добавить"
                  onClick={() => report('Добавить')}
                >
                  +
                </Button>
                <Button loading>Загрузка</Button>
                <Button disabled>Disabled</Button>
              </div>
              <h3>Размеры</h3>
              <div className="gallery-row">
                {(['sm', 'md', 'lg'] as const).map((size, index) => (
                  <Button
                    key={size}
                    size={size}
                    variant="secondary"
                    onClick={() => report(size)}
                  >
                    {['Small', 'Medium', 'Large'][index]}
                  </Button>
                ))}
              </div>
              <p className="gallery-feedback" role="status">
                {message || 'Нажми на кнопку, чтобы попробовать.'}
              </p>
            </Section>
            <Section
              id="Input"
              note="Ввод · подсказка · ошибка · disabled"
              wide
            >
              <div className="gallery-fields">
                <Input
                  label="Название проекта"
                  placeholder="Мой проект"
                  hint="Default"
                />
                <Input
                  label="Email"
                  type="email"
                  placeholder="you@example.com"
                  hint="Рабочая почта для уведомлений"
                  required
                />
                <Input
                  label="Email с ошибкой"
                  defaultValue="not-an-email"
                  error="Введите корректный email"
                />
                <Input
                  label="Адрес сайта"
                  prefix="https://"
                  suffix=".com"
                  placeholder="example"
                  hint="Prefix / suffix"
                />
                <Input
                  label="Недоступное поле"
                  defaultValue="read-only@example.com"
                  disabled
                />
                <Input
                  label="Контролируемый ввод"
                  placeholder="Попробуй напечатать"
                  value={text}
                  onChange={(event) => setText(event.target.value)}
                  hint={`Символов: ${text.length}`}
                />
              </div>
            </Section>
            <Section id="Select" note="Выбор · поиск · состояния">
              <div className="gallery-fields compact">
                <Select
                  label="Framework"
                  options={frameworks}
                  placeholder="Выберите framework"
                  hint="Поиск внутри списка; Angular недоступен"
                />
                <Select
                  label="Выбранное значение"
                  options={frameworks}
                  value={selection}
                  onValueChange={setSelection}
                />
                <Select
                  label="Ошибка выбора"
                  options={frameworks}
                  error="Выберите framework"
                />
                <Select
                  label="Недоступный список"
                  options={frameworks}
                  defaultValue="react"
                  disabled
                />
                <Select
                  label="Пустой список"
                  options={[]}
                  emptyMessage="Ничего не найдено"
                />
              </div>
            </Section>
            <Section id="Checkbox" note="Default · checked · mixed · disabled">
              <div className="gallery-stack">
                <Checkbox label="Обычный checkbox" />
                <Checkbox label="Выбранный checkbox" defaultChecked />
                <Checkbox label="Частично выбрано" indeterminate />
                <Checkbox label="Недоступный checkbox" disabled />
                <Checkbox
                  label="Выбранный, недоступный"
                  defaultChecked
                  disabled
                />
              </div>
            </Section>
            <Section id="Radio" note="Выбор одного значения">
              <fieldset className="gallery-fieldset">
                <legend>Тариф</legend>
                <div className="gallery-stack">
                  <Radio
                    name="plan"
                    value="monthly"
                    label="Ежемесячно"
                    defaultChecked
                  />
                  <Radio name="plan" value="yearly" label="Ежегодно" />
                  <Radio
                    name="plan"
                    value="enterprise"
                    label="Enterprise — недоступно"
                    disabled
                  />
                </div>
              </fieldset>
            </Section>
            <Section id="Switch" note="Off · on · disabled">
              <div className="gallery-stack">
                <Switch label="Уведомления" />
                <Switch label="Автосохранение" defaultChecked />
                <Switch label="Недоступный переключатель" disabled />
                <Switch label="Включён, недоступен" defaultChecked disabled />
              </div>
            </Section>
            <Section id="Modal" note="Диалоги · длинный контент · вложенность">
              <div className="gallery-modal-preview">
                <strong>Создать проект</strong>
                <p>Название и настройки нового проекта.</p>
                <div className="gallery-row">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => setModal('default')}
                  >
                    Открыть диалог
                  </Button>
                </div>
              </div>
              <div className="gallery-row">
                <Button variant="secondary" onClick={() => setModal('long')}>
                  Длинный контент
                </Button>
                <Button variant="secondary" onClick={() => setModal('locked')}>
                  Без закрытия по фону
                </Button>
                <Button variant="ghost" onClick={() => setModal('nested')}>
                  Вложенный диалог
                </Button>
              </div>
            </Section>
            <Section id="Dropdown" note="Меню · disabled · danger">
              <div className="gallery-row">
                <Dropdown
                  label="Действия с проектом"
                  items={[
                    {
                      id: 'edit',
                      label: 'Редактировать',
                      onSelect: () => report('Редактировать'),
                    },
                    {
                      id: 'archive',
                      label: 'Архивировать',
                      disabled: true,
                      onSelect: () => report('Архивировать'),
                    },
                    {
                      id: 'delete',
                      label: 'Удалить',
                      danger: true,
                      onSelect: () => report('Удалить (пример)'),
                    },
                  ]}
                />
                <Dropdown label="Недоступное меню" disabled items={[]} />
              </div>
              <p className="gallery-note">
                Открой меню и попробуй навигацию стрелками.
              </p>
            </Section>
            <Section id="Tooltip" note="Подсказки · задержка · длинный текст">
              <div className="gallery-row">
                <Tooltip content="Сохранить изменения">
                  <Button variant="secondary">Обычная</Button>
                </Tooltip>
                <Tooltip content="Подсказка без задержки" delay={0}>
                  <Button variant="secondary">Сразу</Button>
                </Tooltip>
                <Tooltip content="Подсказка через одну секунду" delay={1000}>
                  <Button variant="secondary">Через 1 с</Button>
                </Tooltip>
                <Tooltip content="Это действие сохраняет все изменения в текущем проекте. После сохранения можно продолжить редактирование.">
                  <Button variant="ghost">Длинный текст</Button>
                </Tooltip>
                <Tooltip content="Подробнее об этой настройке">
                  <Button iconOnly aria-label="Справка" variant="secondary">
                    ?
                  </Button>
                </Tooltip>
              </div>
              <p className="gallery-note">
                Наведи курсор или переведи фокус клавишей Tab.
              </p>
            </Section>
            <Section id="Tabs" note="Вкладки · controlled · disabled">
              <Tabs
                label="Настройки проекта"
                value={tab}
                onValueChange={setTab}
                items={[
                  {
                    value: 'overview',
                    label: 'Обзор',
                    content: <p>Основная информация о проекте.</p>,
                  },
                  {
                    value: 'settings',
                    label: 'Настройки',
                    content: <p>Настройки проекта и уведомлений.</p>,
                  },
                  {
                    value: 'team',
                    label: 'Команда',
                    content: <p>Участники команды и доступы.</p>,
                  },
                  {
                    value: 'billing',
                    label: 'Billing',
                    content: null,
                    disabled: true,
                  },
                ]}
              />
            </Section>
            <Section id="Toast" note="Success · error · info · таймер" wide>
              <Notifications />
            </Section>
            <Section
              id="tokens"
              title="Design tokens"
              note="Цвета · типографика · отступы · скругления"
              wide
            >
              <div className="gallery-swatches">
                {[
                  'bg',
                  'surface',
                  'surface-hover',
                  'text-primary',
                  'text-secondary',
                  'border',
                  'accent',
                  'on-accent',
                  'danger',
                  'focus',
                ].map((color) => (
                  <div key={color}>
                    <span style={{ background: `var(--color-${color})` }} />
                    <code>{color}</code>
                  </div>
                ))}
              </div>
              <div className="gallery-token-grid">
                <div>
                  <h3>Отступы</h3>
                  {[1, 2, 3, 4, 6, 8].map((space) => (
                    <div className="token-space" key={space}>
                      <code>space-{space}</code>
                      <span style={{ width: `var(--space-${space})` }} />
                      <span>{space * 4} px</span>
                    </div>
                  ))}
                </div>
                <div>
                  <h3>Типографика</h3>
                  {['sm', 'md', 'lg', 'title'].map((size) => (
                    <p
                      key={size}
                      style={{ fontSize: `var(--font-size-${size})` }}
                    >
                      {size} · Cyclone UI
                    </p>
                  ))}
                </div>
                <div>
                  <h3>Скругления и тени</h3>
                  <div className="gallery-row">
                    {['sm', 'md', 'lg', 'pill'].map((radius) => (
                      <span
                        className="token-radius"
                        key={radius}
                        style={{ borderRadius: `var(--radius-${radius})` }}
                      >
                        {radius}
                      </span>
                    ))}
                  </div>
                  <div className="gallery-row token-shadows">
                    {['sm', 'lg'].map((shadow) => (
                      <span
                        key={shadow}
                        style={{ boxShadow: `var(--shadow-${shadow})` }}
                      >
                        shadow-{shadow}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <h3>Слои и движение</h3>
              <p className="gallery-note">
                Dropdown 100 · Modal 200 · Tooltip 300 · Toast 400. Переходы:
                150 / 240 мс. Системная настройка уменьшения движения отключает
                анимации.
              </p>
            </Section>
          </div>
          <footer className="gallery-footer">
            Cyclone UI · v{libraryVersion}
            <a href="http://localhost:6006">
              Полная документация в Storybook ↗
            </a>
          </footer>
        </main>
      </div>
      <Modal
        open={modal !== null}
        onClose={closeModal}
        title={modal === 'long' ? 'Настройки проекта' : 'Создать проект'}
        description="Демонстрация диалога Cyclone UI."
        initialFocusRef={firstInput}
        closeOnOverlay={modal !== 'locked'}
        closeLabel="Закрыть диалог"
      >
        <div className="gallery-stack">
          <Input
            ref={firstInput}
            label="Название проекта"
            placeholder="Мой проект"
          />
          <Select
            label="Видимость"
            options={[
              { value: 'private', label: 'Приватный' },
              { value: 'public', label: 'Публичный' },
            ]}
            defaultValue="private"
          />
          {modal === 'long' &&
            Array.from({ length: 20 }, (_, index) => (
              <p key={index}>
                Раздел {index + 1}: проверьте настройки проекта перед
                сохранением.
              </p>
            ))}
          {modal === 'nested' && (
            <Button variant="secondary" onClick={() => setNested(true)}>
              Открыть подтверждение
            </Button>
          )}
          <div className="gallery-row">
            <Button variant="secondary" onClick={closeModal}>
              Отмена
            </Button>
            <Button
              onClick={() => {
                closeModal();
                report('Проект сохранён (пример)');
              }}
            >
              Сохранить
            </Button>
          </div>
        </div>
        <Modal
          open={nested}
          onClose={() => setNested(false)}
          title="Подтверждение"
          closeLabel="Закрыть подтверждение"
        >
          <p>Подтвердите изменения в демонстрационном проекте.</p>
          <Button onClick={() => setNested(false)}>Подтвердить</Button>
        </Modal>
      </Modal>
    </>
  );
}
