from manim import *


class NewtonsMethod(Scene):
    def construct(self):
        # Define the function
        f = lambda x: (x**2 - 4)

        dfdx = lambda x: 0.5 * (f(x + 1) - f(x - 1))

        # Set up axes
        axes = Axes(
            x_range=[-5, 5, 1],
            y_range=[-5, 8, 1],
            x_length=10,
            y_length=6,
            axis_config={"include_numbers": False},
        )
        labels = axes.get_axis_labels(x_label="x", y_label="y")
        quadratic = axes.plot(f, x_range=[-5, 5], color=BLUE)

        xmin = -10
        xmax = 10
        # Add axes and function to the scene
        self.add(axes, labels, quadratic)

        # Initial guess
        x_curr = 1

        # Create initial points and labels
        y_curr = f(x_curr)

        dot_curr = Dot(axes.c2p(x_curr, y_curr), color=YELLOW)

        if f(x_curr) > 0:
            x_curr_label = MathTex(f"x_{{1}}", color=YELLOW).next_to(
                axes.c2p(x_curr, 0), DOWN
            )
        else:
            x_curr_label = MathTex(f"x_{{1}}", color=YELLOW).next_to(
                axes.c2p(x_curr, 0), UP
            )

        vline_curr = DashedLine(
            start=axes.c2p(x_curr, y_curr), end=axes.c2p(x_curr, 0), color=YELLOW
        )

        # Display initial points and labels
        self.play(Create(dot_curr))
        self.play(Write(x_curr_label))
        self.play(Create(vline_curr))

        # Number of iterations
        num_iterations = 3  # Change this to the desired number of iterations
        for i in range(num_iterations):
            # Draw the tangent line
            slope = dfdx(x_curr)
            ymin = f(x_curr) + slope * (xmin - x_curr)
            ymax = f(x_curr) + slope * (xmax - x_curr)
            tangent = Line(axes.c2p(xmin, ymin), axes.c2p(xmax, ymax), color=YELLOW)
            self.play(
                Create(tangent),
                # rate_func=linear,
                run_time=4,
            )

            self.wait(2)

            # Calculate the next approximation
            x_next = x_curr - y_curr / slope
            y_next = f(x_next)

            # Create a dot at x_next on the x-axis
            dot_next = Dot(axes.c2p(x_next, 0), color=RED)
            if f(x_next) > 0:
                x_next_label = MathTex(f"x_{{{i+2}}}", color=RED).next_to(
                    axes.c2p(x_next, 0), DOWN
                )
            else:
                x_next_label = MathTex(f"x_{{{i+2}}}", color=RED).next_to(
                    axes.c2p(x_next, 0), UP
                )
            self.play(
                Create(dot_next),
                Write(x_next_label),
                x_curr_label.animate.set_opacity(0.5),
                dot_curr.animate.set_opacity(0.5),
                vline_curr.animate.set_opacity(0.5),
            )

            self.wait(2)

            # Draw vertical dashed line from (x_next, y_next) to x-axis
            vline_next = DashedLine(
                start=axes.c2p(x_next, y_next), end=axes.c2p(x_next, 0), color=YELLOW
            )

            # Move the dot to the graph
            self.play(dot_next.animate.set_color(YELLOW))
            self.play(
                dot_next.animate.move_to(axes.c2p(x_next, y_next)),
                Create(vline_next),
                x_next_label.animate.set_color(YELLOW),
            )

            # self.play(x_next_label.animate.next_to(axes.c2p(x_next, 0), DOWN))

            # Fade out previous elements if desired
            self.play(
                FadeOut(tangent),
                FadeOut(vline_curr),
                FadeOut(dot_curr),
                FadeOut(x_curr_label),
            )

            # Update variables for the next iteration
            x_curr, y_curr = x_next, y_next

            dot_curr = dot_next
            x_curr_label = x_next_label
            vline_curr = vline_next

        self.wait()

        # Clean up!
        # self.play(
        #     FadeOut(tangent),
        #     # FadeOut(vline_curr),
        #     # FadeOut(dot_curr),
        #     FadeOut(x_curr_label),
        # )
