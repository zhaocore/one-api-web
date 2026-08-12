import { useState, useCallback } from 'react';
import {
  Button,
  Switch,
  Slider,
  Label,
  Skeleton,
  TooltipAnchor,
  Avatar,
  Dropdown,
  OGDialog,
  OGDialogTrigger,
  OGDialogContent,
  OGDialogHeader,
  OGDialogFooter,
  OGDialogTitle,
  OGDialogDescription,
  OGDialogClose,
  useToastContext,
} from '@librechat/client';
import {
  Sun,
  Moon,
  Settings,
  Bell,
  User,
  Check,
  ExternalLink,
  Heart,
  Star,
  Sparkles,
  Palette,
  Zap,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '~/utils';
import { NotificationSeverity } from '~/common';

// ─── Section wrapper ───────────────────────────────────────────
function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-text-primary">{title}</h2>
        {description && (
          <p className="mt-1 text-sm text-text-secondary">{description}</p>
        )}
      </div>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

// ─── Demo card ─────────────────────────────────────────────────
function DemoCard({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        'rounded-xl border border-border-light bg-surface-primary-alt p-5',
        className,
      )}
    >
      {children}
    </div>
  );
}

// ─── Color swatch ──────────────────────────────────────────────
function ColorSwatch({ name, className }: { name: string; className: string }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className={cn('h-10 w-10 rounded-lg border border-border-light shadow-sm', className)} />
      <span className="text-[10px] text-text-tertiary">{name}</span>
    </div>
  );
}

// ─── Theme toggle ──────────────────────────────────────────────
function ThemeToggle() {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'));

  const toggle = useCallback(() => {
    setDark((prev) => {
      const next = !prev;
      document.documentElement.classList.toggle('dark', next);
      document.documentElement.classList.toggle('light', !next);
      localStorage.setItem('color-theme', next ? 'dark' : 'light');
      return next;
    });
  }, []);

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggle}
      aria-label="Toggle theme"
    >
      {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </Button>
  );
}

// ─── Icon badge ────────────────────────────────────────────────
function IconBadge({ icon: Icon, label }: { icon: LucideIcon; label: string }) {
  return (
    <TooltipAnchor description={label}>
      <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-surface-hover text-text-secondary transition-colors hover:bg-surface-active hover:text-text-primary">
        <Icon className="h-5 w-5" />
      </div>
    </TooltipAnchor>
  );
}

// ─── Avatar grid ───────────────────────────────────────────────
function AvatarGrid() {
  const seeds = ['Avery', 'Mia', 'James', 'Leo', 'Emma', 'Noah'];
  return (
    <div className="flex flex-wrap gap-3">
      {seeds.map((seed) => (
        <Avatar key={seed} size="lg" seed={seed} />
      ))}
    </div>
  );
}

// ─── Main Demo Page ────────────────────────────────────────────
export default function DemoPage() {
  const { showToast } = useToastContext();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [switchOn, setSwitchOn] = useState(false);
  const [sliderVal, setSliderVal] = useState([50]);
  const [dropdownVal, setDropdownVal] = useState('Option 1');

  const dropdownOptions = [
    { value: 'Option 1', label: 'Option 1' },
    { value: 'Option 2', label: 'Option 2' },
    { value: 'Option 3', label: 'Option 3' },
    { value: 'Option 4', label: 'Option 4 (disabled)', disabled: true },
  ];

  return (
    <div className="mx-auto flex h-full max-w-4xl flex-col overflow-y-auto">
      {/* ── Header ── */}
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-border-light bg-surface-primary/80 px-6 py-3 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-purple">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <div>
            <h1 className="text-base font-semibold text-text-primary">UI Kit Demo</h1>
            <p className="text-xs text-text-tertiary">Component Showcase</p>
          </div>
        </div>
        <ThemeToggle />
      </header>

      {/* ── Hero banner ── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-surface-secondary via-surface-primary to-brand-purple/5 px-6 py-12">
        <div className="relative">
          <h2 className="text-3xl font-bold tracking-tight text-text-primary">
            Design System
            <span className="ml-2 inline-block animate-pulse text-brand-purple">✦</span>
          </h2>
          <p className="mt-2 max-w-md text-text-secondary">
            A showcase of all available UI components built with Radix UI primitives,
            styled with Tailwind CSS, and animated with Framer Motion.
          </p>
          <div className="mt-4 flex gap-2">
            <IconBadge icon={Palette} label="Multiple themes" />
            <IconBadge icon={Zap} label="Fast & responsive" />
            <IconBadge icon={Heart} label="Accessible" />
          </div>
        </div>
        <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-brand-purple/10 blur-3xl" />
        <div className="absolute -bottom-8 left-1/3 h-32 w-32 rounded-full bg-green-400/10 blur-2xl" />
      </div>

      {/* ── Content ── */}
      <div className="space-y-10 px-6 py-8">
        {/* ── Buttons ── */}
        <Section title="Buttons" description="All button variants (default, secondary, outline, ghost, destructive, submit, link) and sizes (sm, default, lg, icon).">
          <DemoCard>
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="default">Default</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="submit">Submit</Button>
              <Button variant="link">Link</Button>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <Button size="sm" variant="outline">Small</Button>
              <Button size="default" variant="outline">Default</Button>
              <Button size="lg" variant="outline">Large</Button>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <Button size="icon" variant="ghost"><Settings className="h-4 w-4" /></Button>
              <Button size="icon" variant="ghost"><Bell className="h-4 w-4" /></Button>
              <Button size="icon" variant="ghost"><User className="h-4 w-4" /></Button>
              <Button size="icon" variant="ghost"><Star className="h-4 w-4" /></Button>
            </div>
          </DemoCard>
        </Section>

        {/* ── Toggle & Slider ── */}
        <Section title="Toggle & Slider" description="Switch toggle and range slider controls.">
          <DemoCard>
            <div className="flex flex-wrap items-center gap-8">
              <div className="flex items-center gap-3">
                <Switch
                  id="switch-demo"
                  checked={switchOn}
                  onCheckedChange={setSwitchOn}
                  aria-label="Toggle feature"
                />
                <Label htmlFor="switch-demo" className="text-sm text-text-primary">
                  {switchOn ? 'Enabled' : 'Disabled'}
                </Label>
              </div>

              <div className="flex w-full max-w-xs items-center gap-4">
                <Label className="text-sm text-text-secondary">0</Label>
                <Slider
                  value={sliderVal}
                  onValueChange={setSliderVal}
                  max={100}
                  step={1}
                  aria-label="Slider demo"
                  className="flex-1"
                />
                <Label className="min-w-[2rem] text-right text-sm text-text-secondary">
                  {sliderVal[0]}
                </Label>
              </div>
            </div>
          </DemoCard>
        </Section>

        {/* ── Dialog ── */}
        <Section title="Dialog" description="Modal dialog with overlay, header, content, and footer.">
          <DemoCard>
            <OGDialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <OGDialogTrigger asChild>
                <Button variant="outline">
                  Open Dialog
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </OGDialogTrigger>
              <OGDialogContent className="sm:max-w-md">
                <OGDialogHeader>
                  <OGDialogTitle>Confirm Action</OGDialogTitle>
                  <OGDialogDescription>
                    This is a demo dialog. Click confirm to see a toast notification.
                  </OGDialogDescription>
                </OGDialogHeader>
                <div className="py-2 text-sm text-text-secondary">
                  <p>Built with @radix-ui/react-dialog and styled with Tailwind.</p>
                </div>
                <OGDialogFooter>
                  <OGDialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </OGDialogClose>
                  <Button
                    variant="submit"
                    onClick={() => {
                      showToast({
                        message: 'Action confirmed! ✓',
                        severity: NotificationSeverity.SUCCESS,
                        duration: 2500,
                      });
                      setDialogOpen(false);
                    }}
                  >
                    <Check className="h-4 w-4" />
                    Confirm
                  </Button>
                </OGDialogFooter>
              </OGDialogContent>
            </OGDialog>

            <p className="mt-3 text-sm text-text-tertiary">
              Press <kbd className="rounded border border-border-light px-1.5 py-0.5 text-xs font-mono">Esc</kbd> to close the dialog.
            </p>
          </DemoCard>
        </Section>

        {/* ── Dropdown ── */}
        <Section title="Dropdown" description="Select from a list of options using @ariakit/react.">
          <DemoCard>
            <div className="flex flex-wrap items-center gap-4">
              <Dropdown
                value={dropdownVal}
                onChange={(v) => setDropdownVal(v)}
                options={dropdownOptions}
                className="w-48"
              />
              <p className="text-sm text-text-tertiary">
                Selected: <span className="font-medium text-text-primary">{dropdownVal}</span>
              </p>
            </div>
          </DemoCard>
        </Section>

        {/* ── Toast ── */}
        <Section title="Toast Notifications" description="Click buttons to trigger different toast severities.">
          <DemoCard>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                onClick={() =>
                  showToast({
                    message: 'Successfully saved!',
                    severity: NotificationSeverity.SUCCESS,
                  })
                }
              >
                Success
              </Button>
              <Button
                variant="outline"
                onClick={() =>
                  showToast({
                    message: 'Here is some information.',
                    severity: NotificationSeverity.INFO,
                  })
                }
              >
                Info
              </Button>
              <Button
                variant="outline"
                onClick={() =>
                  showToast({
                    message: 'Warning: check your input.',
                    severity: NotificationSeverity.WARNING,
                  })
                }
              >
                Warning
              </Button>
              <Button
                variant="destructive"
                onClick={() =>
                  showToast({
                    message: 'Something went wrong!',
                    severity: NotificationSeverity.ERROR,
                  })
                }
              >
                Error
              </Button>
            </div>
          </DemoCard>
        </Section>

        {/* ── Avatar ── */}
        <Section title="Avatar" description="Generated avatars using DiceBear in different sizes.">
          <DemoCard>
            <AvatarGrid />
            <div className="mt-3 flex items-center gap-3">
              <Avatar size="sm" seed="Small" />
              <Avatar size="md" seed="Medium" />
              <Avatar size="lg" seed="Large" />
              <span className="text-xs text-text-tertiary">sm · md · lg</span>
            </div>
          </DemoCard>
        </Section>

        {/* ── Skeleton ── */}
        <Section title="Skeleton" description="Loading placeholder animations.">
          <DemoCard>
            <div className="flex items-center space-x-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </DemoCard>
        </Section>

        {/* ── Tooltip ── */}
        <Section title="Tooltip" description="Hover over elements to reveal tooltips (animated with Framer Motion).">
          <DemoCard>
            <div className="flex flex-wrap gap-3">
              <TooltipAnchor side="top" description="This tooltip appears above">
                <Button variant="outline" size="sm">Hover (top)</Button>
              </TooltipAnchor>
              <TooltipAnchor side="right" description="Tooltip on the right side">
                <Button variant="outline" size="sm">Hover (right)</Button>
              </TooltipAnchor>
              <TooltipAnchor side="bottom" description="Tooltip on the bottom">
                <Button variant="outline" size="sm">Hover (bottom)</Button>
              </TooltipAnchor>
              <TooltipAnchor side="left" description="Tooltip on the left side">
                <Button variant="outline" size="sm">Hover (left)</Button>
              </TooltipAnchor>
            </div>
          </DemoCard>
        </Section>

        {/* ── Color Palette ── */}
        <Section title="Color Palette" description="Design tokens — switch between light and dark mode to see them change.">
          <DemoCard>
            <div className="space-y-4">
              <div>
                <p className="mb-2 text-xs font-medium uppercase tracking-wider text-text-tertiary">Surface</p>
                <div className="flex flex-wrap gap-2">
                  <ColorSwatch name="primary" className="bg-surface-primary" />
                  <ColorSwatch name="primary-alt" className="bg-surface-primary-alt" />
                  <ColorSwatch name="secondary" className="bg-surface-secondary" />
                  <ColorSwatch name="tertiary" className="bg-surface-tertiary" />
                  <ColorSwatch name="hover" className="bg-surface-hover" />
                  <ColorSwatch name="active" className="bg-surface-active" />
                  <ColorSwatch name="dialog" className="bg-surface-dialog" />
                </div>
              </div>
              <div>
                <p className="mb-2 text-xs font-medium uppercase tracking-wider text-text-tertiary">Text</p>
                <div className="flex flex-wrap gap-2">
                  <ColorSwatch name="primary" className="bg-text-primary" />
                  <ColorSwatch name="secondary" className="bg-text-secondary" />
                  <ColorSwatch name="tertiary" className="bg-text-tertiary" />
                </div>
              </div>
              <div>
                <p className="mb-2 text-xs font-medium uppercase tracking-wider text-text-tertiary">Border</p>
                <div className="flex flex-wrap gap-2">
                  <ColorSwatch name="light" className="bg-border-light" />
                  <ColorSwatch name="medium" className="bg-border-medium" />
                  <ColorSwatch name="heavy" className="bg-border-heavy" />
                </div>
              </div>
              <div>
                <p className="mb-2 text-xs font-medium uppercase tracking-wider text-text-tertiary">Accent</p>
                <div className="flex flex-wrap gap-2">
                  <ColorSwatch name="brand-purple" className="bg-brand-purple" />
                  <ColorSwatch name="submit" className="bg-surface-submit" />
                  <ColorSwatch name="destructive" className="bg-surface-destructive" />
                </div>
              </div>
            </div>
          </DemoCard>
        </Section>

        {/* ── Typography ── */}
        <Section title="Typography" description="Text hierarchy — headings, body, secondary, caption, and code.">
          <DemoCard>
            <div className="space-y-5">
              <div>
                <p className="text-xs uppercase tracking-wider text-text-tertiary">Heading 1</p>
                <h1 className="text-3xl font-bold text-text-primary">The quick brown fox</h1>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-text-tertiary">Heading 2</p>
                <h2 className="text-2xl font-semibold text-text-primary">Jumps over the lazy dog</h2>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-text-tertiary">Body</p>
                <p className="text-base text-text-primary">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-text-tertiary">Secondary</p>
                <p className="text-sm text-text-secondary">
                  Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-text-tertiary">Caption</p>
                <p className="text-xs text-text-tertiary">
                  Ut enim ad minim veniam, quis nostrud exercitation.
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-text-tertiary">Code</p>
                <code className="inline-block rounded-md bg-surface-secondary px-2 py-1 font-mono text-sm text-text-primary">
                  console.log(&quot;hello world&quot;)
                </code>
              </div>
            </div>
          </DemoCard>
        </Section>

        {/* ── Footer ── */}
        <footer className="border-t border-border-light py-6 text-center">
          <p className="text-xs text-text-tertiary">
            Built with React · Tailwind CSS · Radix UI · Framer Motion · Ariakit
          </p>
        </footer>
      </div>
    </div>
  );
}
