# Adaptive Cumulative DVH

**Designed by MPE Ali Eid**

Cumulative dose evaluation for MR-Linac online-adaptive SBRT (5 fractions). Each adapted plan's plan-total DVH is reduced to its delivered one-fraction share, the shares are summed across fractions, and the cumulative constraint values are compared with the reference plan and with rigid and deformable dose-accumulation sums.

## Sites and default constraints
| Site | Default prescription | Constraint source |
|---|---|---|
| Prostate | 36.25 Gy / 5 | Department Monaco template |
| Liver | 50 Gy / 5 | Department Monaco template |
| Lung | 50 Gy / 5 | AAPM TG-101 (5 fx), HyTEC cord, UK 2022 consensus lung V20Gy, Dunlap chest wall V30Gy |
| Pancreas | 50 Gy / 5 (SMART); ASTRO 2019: 33–40 Gy / 5 | SMART trial GI V33Gy ≤ 1 cm³, TG-101, HyTEC cord |
| Renal | 40 Gy / 5 | AAPM TG-101 (5 fx), HyTEC cord |
| Adrenal | 40 Gy / 5 | AAPM TG-101 (5 fx), HyTEC cord |
| Bone | 35 Gy / 5 | AAPM TG-101 (5 fx), HyTEC cord (all organs optional) |
| Stomach | 40 Gy / 5 | AAPM TG-101 (5 fx), HyTEC cord |

Target rows for the new sites follow a common SBRT convention (PTV V100% Rx ≥ 95%, PTV D99% ≥ 90% Rx, GTV/ITV D98% ≥ 100% Rx). Default prescriptions are starting values; set each case's prescription in the app.

**Editing:** section 7 lets you rename, add or remove organs, change how they are matched to export names, and add, edit or remove constraints (dose in Gy or % of prescription; volume in cm³ or %; V, D, Dmean or volume-below-dose; minor-deviation tolerance; source). Edited sets are saved on that computer and can be exported/imported as .json.

**Adaptation:** each fraction can be tagged ATP or ATS and given its MR series (e.g. MR3). The app suggests both from the contour volumes and the rigid-sum plan name; they are stored in the archive and exported.

References: Benedict SH et al. AAPM TG-101, Med Phys 2010;37:4078–4101 · Sahgal A et al. Spinal cord dose tolerance to SBRT (HyTEC), IJROBP 2021;110:124–136 · Diez P et al. UK 2022 consensus on normal tissue dose-volume constraints for SABR, Clin Oncol 2022;34:288–300 · Parikh PJ et al. SMART phase 2 trial, IJROBP 2023 · Dunlap NE et al. IJROBP 2010;76:796–801 · ASTRO pancreatic cancer guideline, Pract Radiat Oncol 2019.

## Inputs
| Slot | File |
|---|---|
| Reference plan | Monaco DVH export (.txt), absolute volume preferred |
| Fraction 1–5 | Monaco plan-total DVH exports, absolute volume (single-fraction "partial" exports also accepted) |
| Rigid sum | Monaco summed-plan DVH on the reference CT |
| Deformable sum | RayStation DVH export (.dvh) |

Drop all files at once: they are sorted by file name (`Ref…`, `Fr01…Fr05`, `Rigid`, `deform…`/`.dvh`).

## Case archive
Save each evaluated case to the archive (section 5), then export every case at once:
- **Export for statistics (.xlsx):** sheets *Summary* (per constraint and method: N, mean, SD, median, range, pass counts, paired differences vs reference and vs deformable), *Cases*, *Constraints* (one row per case and constraint), *Structure metrics* (volume, Dmean, D0.035cc, D2%, D50%, D98%) and *Long* (one row per value, for R/SPSS/Python).
- **Export CSV (long format)** for statistics software.
- **Anonymise exports** numbers cases C001, C002… and leaves out patient IDs, labels and file names.
- **Back up (.json) / Restore backup** to keep the archive safe or move it to another computer.

The archive is stored on the computer running the app (browser storage in the website version, the program's own storage in the Windows version) and is never uploaded.

## Privacy
All files are read inside the browser. Nothing is uploaded and patient names are never displayed.

## Method
DVH-parameter summation. Dose metrics (Dx, D100%, Dmean): Σ(D_i,total ÷ n). Volume metrics: mean of the fraction values at the same threshold. See the Method section in the app.

**One fraction from a plan total.** A plan-total value divided by the number of fractions is that day's delivered fraction; the cumulative is the sum of the delivered fractions. A single-fraction ("partial") export is the same quantity read directly; the two agree within one dose bin. An export is taken as a single fraction when the target's near-maximum dose (D2%) stays near 1/n of the prescription; the *Type* menu on each fraction overrides this. *Delivered share* in section 4 shows each fraction's one-fraction value and their sum.

**Dose units (v1.5).** Monaco writes "Dose Units: Gy" in the header even when the DVH was exported in relative dose, i.e. in % of the prescription. The app reads the units from the data instead: a Gy export has every dose value at a bin centre of the header's bin width; a relative-dose export reaches that grid only after multiplying by prescription ÷ 100, and the smallest prescription that does so is the file's 100% dose. Such a file is converted to Gy exactly and marked "Dose % → Gy". Where the grid cannot decide (bins finer than 0.004 Gy, or a prescription of 20, 33.33 or 100 Gy) a file whose target reads about 100 is held back: none of its values are reported, and no cumulative is formed from it, until it is read as % of the prescription with one click. Nothing is rescaled automatically; by hand a fraction can be rescaled to the others or excluded, and the rigid sum rescaled to the cumulative.

Versions 1.2–1.4 rescaled such a file approximately (up to about 0.6% low for that fraction), or left it unconverted when the reference or most fractions were affected (doses near 95–100 "Gy"). Cases archived that way are marked "re-save", flagged in the exports (column *Re-save*) and left out of the *Summary* sheet: reload their files and choose *Replace*.

**Volume units.** An absolute (cm³) export carries each structure's own volume. A relative (%) export does not, so its cm³ limits use the reference-CT volume of the structure: exact for ATP fractions and for sums evaluated on the reference CT, approximate for ATS fractions. Limits written in % are the same from either export. Export fractions in absolute volume.

**Rigid and deformable sums.** Rigid: Monaco plan sum of the fractions on the reference CT, or a RayStation rigid accumulation. Deformable: all fraction doses deformed to the reference CT in RayStation (ANACONDA) and summed.

## Install
- **PC (Edge/Chrome):** open the site, then the install icon in the address bar → *Install*. Works offline after the first visit.
- **iPhone:** open in Safari → Share → *Add to Home Screen*.
- **Windows desktop program:** download `AdaptiveCumulativeDVH-win-x64.zip` from Releases, unzip, run `Adaptive Cumulative DVH.exe`.

For clinical physics review. Verify against the planning system before any decision.
